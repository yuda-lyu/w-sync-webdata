import assert from 'assert'
import fs from 'fs'
import w from 'wsemi'
import WSyncWebdataServer from '../src/WSyncWebdataServer.mjs'
import { traceRec, useFakeClock } from './tools/timeKit.mjs'
import { fence, activeTimers, baselineTimers, settleTimers } from './tools/syncKit.mjs'


//fdTmp, 測試暫存資料夾(已列gitignore), 測完刪除; 各伺服端實體一律指定fpTableTags, 不寫預設之./tableTags.json
let fdTmp = './test/_tmp/unit-WSyncWebdataServer'

//sleep, 僅供否定觀察窗(確認某事件不再發生)使用, 不作為肯定斷言之同步點; 肯定斷言一律以事件同步(waitEv、tr.wait、fence)
let sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

//watchGlobal, 記錄行程層之unhandledRejection與uncaughtException
let watchGlobal = () => {
    let r = []
    let onRej = (err) => {
        r.push(`unhandledRejection: ${err}`)
    }
    let onExc = (err) => {
        r.push(`uncaughtException: ${err}`)
    }
    process.on('unhandledRejection', onRej)
    process.on('uncaughtException', onExc)
    let off = () => {
        process.off('unhandledRejection', onRej)
        process.off('uncaughtException', onExc)
    }
    return { r, off }
}

//stubConsoleError, 暫時接管console.error
let stubConsoleError = () => {
    let ce = console.error
    let logs = []
    console.error = (...args) => {
        logs.push(args)
    }
    let restore = () => {
        console.error = ce
    }
    return { logs, restore }
}

//fpOf, 各測試使用不同之時間戳檔
let nFp = 0
let fpOf = () => {
    nFp++
    return `${fdTmp}/tableTags-${nFp}.json`
}

//mkServer, 建立伺服端同步器並依序記錄各事件; tr為觀察回調(onTrace)之紀錄器, rec為公開事件之紀錄器, waitEv(name, n, from)等第n個公開事件
let mkServer = (opt = {}) => {
    let fp = opt.fpTableTags || fpOf()
    let nt = 0
    let tr = traceRec()
    let rec = traceRec()
    let s = new WSyncWebdataServer(w.evem(), {
        fpTableTags: fp,
        genTag: opt.genTag || (() => {
            nt++
            return `t${nt}`
        }),
        onTrace: tr.on,
    })
    let evs = []
    s.on('changeTableTags', (msg) => {
        evs.push({ name: 'changeTableTags', msg: { ...msg } })
        rec.on({ type: 'changeTableTags', msg: { ...msg } })
    })
    s.on('error', (msg) => {
        evs.push({ name: 'error', msg })
        rec.on({ type: 'error', msg })
    })
    let of = (name) => {
        return evs.filter((v) => v.name === name).map((v) => v.msg)
    }
    let read = () => {
        return JSON.parse(fs.readFileSync(fp, 'utf8'))
    }
    let waitEv = (name, n = 1, from = 0) => {
        return rec.wait((e) => e.type === name, from, n)
    }
    return { s, fp, evs, of, read, tr, rec, waitEv }
}


describe('WSyncWebdataServer', function() {

    //n0, 測前作用中之計時器數; 測完須回到此值(否則行程不會結束), 失敗時指出而非整個執行懸置; 伺服端合併窗口之偵測計時器於佇列清空後自停(未釋放者)或於clearSync時由wsemi debounce之cancel立即清除, 故以輪詢等待
    let n0 = 0

    before(async function() {
        n0 = await baselineTimers()
        fs.rmSync(fdTmp, { recursive: true, force: true })
        fs.mkdirSync(fdTmp, { recursive: true })
    })

    after(async function() {
        fs.rmSync(fdTmp, { recursive: true, force: true })
        await settleTimers(n0, 'WSyncWebdataServer')
    })

    it('S1 S2 updateTableTag後經debounce寫檔並發一則changeTableTags, 連續更新合併為一次', async function() {
        //同步點: changeTableTags事件(合併窗口屆滿後寫檔並推播); 合併以觀察回調佐證(兩筆排入、首次flush即丟棄1筆); 合併窗口之長度見S1b(假時鐘)
        let { s, of, read, tr, waitEv } = mkServer()
        s.initTableTags({ A: 'a0', B: 'b0' }, 'useInputOnly')
        s.updateTableTag('A')
        s.updateTableTag('B')
        await waitEv('changeTableTags')
        assert.strict.deepEqual(of('changeTableTags'), [{ A: 't1', B: 't2' }])
        assert.strict.deepEqual(read(), { A: 't1', B: 't2' })
        assert.strict.deepEqual(tr.events.map((e) => ({ ...e })), [
            { type: 'queued', tableName: 'A' },
            { type: 'queued', tableName: 'B' },
            { type: 'flush', dropped: 1 },
        ])
    })

    it('S1b 合併窗口以最後一次更新起算, 屆滿前不寫檔不推播, 屆滿後只推播一次(假時鐘)', async function() {
        //規格: 200ms內之多次更新合併為一次寫檔與推播, 持續更新時推播延至更新停止後; wsemi之debounce每10ms偵測, 故屆滿後至多再10ms內觸發
        let clock = useFakeClock(0)
        try {
            let { s, of, read, tr } = mkServer()
            s.initTableTags({ A: 'a0', B: 'b0' }, 'useInputOnly')
            s.updateTableTag('A') //t=0
            await clock.advance(150)
            s.updateTableTag('B') //t=150, 視窗自此重新起算
            await clock.advance(199) //t=349, 距最後一次更新199ms
            assert.strict.deepEqual(tr.types(), ['queued', 'queued'])
            assert.strict.deepEqual(of('changeTableTags'), [])
            assert.strict.deepEqual(read(), { A: 'a0', B: 'b0' })
            await clock.advance(30) //t=379, 已超過最後一次更新200ms
            assert.strict.deepEqual(tr.types(), ['queued', 'queued', 'flush'])
            assert.strict.equal(tr.events[2].dropped, 1)
            assert.strict.deepEqual(read(), { A: 't1', B: 't2' })
            await clock.advance(5) //1ms派發
            assert.strict.deepEqual(of('changeTableTags'), [{ A: 't1', B: 't2' }])
            await clock.advance(1000)
            assert.strict.equal(of('changeTableTags').length, 1)
            assert.strict.deepEqual(tr.types(), ['queued', 'queued', 'flush'])
        }
        finally {
            clock.restore()
        }
    })

    it('S1c 釋放後合併窗口屆滿不寫檔不推播, 不再呼叫觀察回調(假時鐘)', async function() {
        //規格: clearSync後各寫入類函數不作用且不再派發任何事件; clearSync呼叫wsemi debounce之cancel丟棄已排入之任務, 故屆滿時不執行(不寫檔、不推播、不呼叫觀察回調); 計時器立即清除見S23~S25
        let clock = useFakeClock(0)
        try {
            let fp = fpOf()
            let a = mkServer({ fpTableTags: fp })
            a.s.initTableTags({ A: 'a0' }, 'useInputOnly')
            a.s.updateTableTag('A') //待寫
            a.s.clearSync() //同步落檔{A:'t1'}
            assert.strict.deepEqual(a.read(), { A: 't1' })
            let b = mkServer({ fpTableTags: fp })
            b.s.initTableTags({ A: 'new' }, 'useInputOnly') //新實體接手
            await clock.advance(1000) //遠逾合併窗口
            assert.strict.deepEqual(b.read(), { A: 'new' })
            assert.strict.equal(a.evs.length, 0)
            assert.strict.deepEqual(a.tr.types(), ['queued'])
        }
        finally {
            clock.restore()
        }
    })

    it('S4 changeTableTags監聽器拋錯時轉為一則error, 不使行程崩潰', async function() {
        let g = watchGlobal()
        let { s, of, waitEv } = mkServer()
        let boom = new Error('boom')
        s.on('changeTableTags', () => {
            throw boom
        })
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        s.updateTableTag('A')
        await waitEv('error')
        await fence()
        g.off()
        assert.strict.deepEqual(g.r, [])
        assert.strict.deepEqual(of('error'), [{ msg: 'listener of event[changeTableTags] error', err: boom }])
    })

    it('S5 error監聽器拋錯時以console.error輸出且不遞迴, 不使行程崩潰', async function() {
        let g = watchGlobal()
        let st = stubConsoleError()
        let n = 0
        try {
            let s = new WSyncWebdataServer(w.evem(), { fpTableTags: fdTmp }) //路徑為資料夾, 寫檔必失敗
            s.on('error', () => {
                n++
                throw new Error('error listener boom')
            })
            s.writeTableTags()
            await fence() //error事件已排程(1ms), 柵欄完成時已派發
        }
        finally {
            st.restore()
            g.off()
        }
        assert.strict.deepEqual(g.r, [])
        assert.strict.equal(n, 1)
        assert.strict.equal(st.logs.length, 1)
    })

    it('S6 寫檔失敗時發error(writeTableTags catch)', async function() {
        let { s, of, waitEv } = mkServer({ fpTableTags: fdTmp })
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        await waitEv('error')
        await fence()
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'writeTableTags catch')
    })

    it('S7 讀檔內容非JSON時回傳空物件', function() {
        let fp = fpOf()
        fs.writeFileSync(fp, 'not json', 'utf8')
        let { s } = mkServer({ fpTableTags: fp })
        assert.strict.deepEqual(s.readTableTags(), {})
    })

    it('S8 initTableTags之mode無效時同步拋錯', function() {
        let { s } = mkServer()
        assert.throws(() => {
            s.initTableTags({ A: 'a0' }, 'invalidMode')
        }, /invalid mode\[invalidMode\]/)
    })

    it('S9 genTag拋錯時同步拋至updateTableTag之呼叫端', function() {
        let { s } = mkServer({
            genTag: () => {
                throw new Error('gen fail')
            },
        })
        assert.throws(() => {
            s.updateTableTag('A')
        }, /gen fail/)
    })

    it('S19 時間戳無法序列化時不寫檔(既有檔案不被截空)並發error', async function() {
        let n = 0
        let { s, of, read, waitEv } = mkServer({
            genTag: () => {
                n++
                return n === 1 ? 'a0' : BigInt(n)
            },
        })
        s.initTableTags({ A: 'x' }, 'useInputOnly')
        s.updateTableTag('A') //a0, 可序列化
        await waitEv('changeTableTags', 1)
        assert.strict.deepEqual(read(), { A: 'a0' })
        s.updateTableTag('A') //BigInt, 不可序列化
        await waitEv('changeTableTags', 2) //寫檔失敗之error先於同一次flush之changeTableTags排程, 故此時error已派發
        assert.strict.deepEqual(read(), { A: 'a0' })
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'writeTableTags catch')
        assert.ok(String(errs[0].err).includes('can not serialize tableTags'))
    })

    it('S20 initTableTags與setTableTags之null視同{}, 非物件發error且不作用; updateTableTag之表名非有效字串時發error且不作用', async function() {
        let { s, of, read, tr, waitEv } = mkServer()
        s.initTableTags(null, 'useInputOnly')
        s.updateTableTag('A')
        await waitEv('changeTableTags', 1)
        assert.strict.deepEqual(read(), { A: 't1' })
        s.initTableTags('abc', 'useInputOnly')
        s.setTableTags(['x'])
        s.setTableTags(null)
        s.updateTableTag(undefined)
        s.updateTableTag({})
        await waitEv('error', 4)
        assert.strict.deepEqual(read(), { A: 't1' })
        assert.strict.deepEqual(of('error').map((v) => v.msg), [
            'invalid tableTags for initTableTags',
            'invalid tableTags for setTableTags',
            'invalid tableName',
            'invalid tableName',
        ])
        //無效之表名不排入合併佇列(排入者於窗口屆滿後會再推播)
        assert.strict.deepEqual(tr.types(), ['queued', 'flush'])
    })

    it('S22 無error監聽者時本套件之error改以console.error輸出', async function() {
        let st = stubConsoleError()
        try {
            let s = new WSyncWebdataServer(w.evem(), { fpTableTags: fdTmp }) //路徑為資料夾, 寫檔必失敗
            s.writeTableTags()
            await fence()
        }
        finally {
            st.restore()
        }
        assert.strict.equal(st.logs.length, 1)
        assert.strict.equal(st.logs[0][0], '[w-sync-webdata]')
        assert.strict.equal(st.logs[0][1].msg, 'writeTableTags catch')
    })

    it('S10 S18 clearSync時同步落檔待寫之時間戳且不推播, 之後同檔之新實體不被覆寫', async function() {
        let fp = fpOf()
        let a = mkServer({ fpTableTags: fp })
        a.s.initTableTags({ A: 'a0' }, 'useInputOnly')
        a.s.updateTableTag('A') //待寫
        a.s.clearSync()
        assert.strict.deepEqual(a.read(), { A: 't1' })
        let b = mkServer({ fpTableTags: fp })
        b.s.initTableTags({ A: 'new' }, 'useInputOnly')
        a.s.updateTableTag('A') //釋放後不作用
        await sleep(350)
        assert.strict.deepEqual(b.read(), { A: 'new' })
        assert.strict.equal(a.evs.length, 0)
    })

    it('S21 先建新實體、後釋放舊實體時, 舊實體不覆寫新實體之檔', async function() {
        let fp = fpOf()
        let a = mkServer({ fpTableTags: fp })
        a.s.initTableTags({ A: 'a0' }, 'useInputOnly')
        a.s.updateTableTag('A') //待寫
        let b = mkServer({ fpTableTags: fp })
        b.s.initTableTags({ A: 'new' }, 'useInputOnly')
        a.s.clearSync()
        await sleep(350)
        assert.strict.deepEqual(b.read(), { A: 'new' })
        assert.strict.equal(a.evs.length, 0)
    })

    it('S11 S12 S13 S14 clearSync後寫入類函數不作用、讀取類照常, 且可重複呼叫', async function() {
        let { s, evs, read } = mkServer()
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        s.clearSync()
        s.clearSync()
        s.updateTableTag('A')
        s.setTableTags({ B: 'b0' })
        s.initTableTags({ C: 'c0' }, 'useInputOnly')
        s.writeTableTags()
        await sleep(350)
        assert.strict.deepEqual(read(), { A: 'a0' })
        assert.strict.deepEqual(s.getTableTags(), { A: 'a0' })
        assert.strict.deepEqual(s.readTableTags(), { A: 'a0' })
        assert.strict.equal(evs.length, 0)
    })

    it('S15 clearSync落檔失敗時於函數內同步發一則error', function() {
        let n = 0
        let { s, of } = mkServer({
            genTag: () => {
                n++
                return BigInt(n)
            },
        })
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        s.updateTableTag('A') //待寫, 且不可序列化
        s.clearSync()
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'writeTableTags catch')
    })

    it('S16 clearSync前已排程之事件不再派發', async function() {
        let { s, evs } = mkServer({ fpTableTags: fdTmp })
        s.writeTableTags() //寫檔失敗之error已排程(1ms後派發)
        s.clearSync()
        await sleep(30)
        assert.strict.equal(evs.length, 0)
    })

    it('S16b 讀取類函數之失敗(讀檔拋錯)於釋放前發error事件, clearSync後不再派發', async function() {
        //規格(clearSync JSDoc): 之後各寫入類函數皆不作用且不再派發任何事件, 讀取類函數照常; 讀取類之失敗通報亦屬事件, 釋放後不派發
        let { s, of, waitEv } = mkServer({ fpTableTags: fdTmp }) //路徑為資料夾, 讀檔必拋錯
        s.readTableTags()
        await waitEv('error')
        assert.strict.deepEqual(of('error').map((v) => v.msg), ['readTableTags catch'])
        s.clearSync()
        s.readTableTags()
        await fence() //釋放後若仍派發, 其已排程於此柵欄之前
        assert.strict.equal(of('error').length, 1)
    })

    it('S23 clearSync當下(同步)偵測計時器即被取消, 作用中之計時器數回到排入前(wsemi debounce之cancel, 不留存活計時器)', async function() {
        //規格R11規則5、R7: clearSync呼叫debounce之cancel, 偵測計時器於呼叫當下立即清除(修前無cancel: 至多再存活約210ms才自停); 計時器數以同步量測, 前後之間不讓出事件迴圈, 不依賴經過多少毫秒、不輪詢
        //基準須在讓出一次之後取(此時mocha對本案之逾時計時器已建立並計入, 與settleTimers之量測同一狀態); 同步段取之基準不含該計時器, 會讓「回到基準」恆差1而偶發失敗(2026-10-29 負載試驗3/100)
        let n0 = await baselineTimers()
        let { s } = mkServer()
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        s.updateTableTag('A') //排入合併佇列, 偵測計時器啟動
        assert.ok(activeTimers() > n0, '量測有效: 排入後作用中之計時器數增加')
        s.clearSync()
        assert.strict.equal(activeTimers(), n0)
    })

    it('S23b clearSync不論有無待寫皆取消偵測計時器(待寫旗標已清除而合併佇列仍有任務者)', async function() {
        //規格R7: cancel為無條件呼叫, 不隨「有無待落檔之時間戳」而定; writeTableTags落檔後待寫旗標清除, 但合併佇列之任務仍待屆滿
        let n0 = await baselineTimers()
        let { s, read } = mkServer()
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        s.updateTableTag('A')
        s.writeTableTags() //待寫旗標清除, 合併佇列之任務仍在
        assert.strict.deepEqual(read(), { A: 't1' })
        assert.ok(activeTimers() > n0, '量測有效: 合併佇列之任務仍在, 偵測計時器作用中')
        s.clearSync() //無待落檔者, 不寫檔, 仍須取消
        assert.strict.equal(activeTimers(), n0)
    })

    it('S23c 合併窗口剛屆滿後(佇列已空, 偵測計時器待下次偵測才自停)clearSync亦立即取消偵測計時器與已排程之派發', async function() {
        //規格R7: 屆滿後至偵測計時器自停(約10ms)之間釋放者, 修前該計時器仍存活至下次偵測; 同步點為flush事件, 續行時該次偵測回呼已執行完畢(寫檔完成、changeTableTags派發已排程)
        //以釋放前後之差值斷言(兩次量測之間不讓出, 不受他處計時器於等待期間增減之影響): 此刻本實體作用中之計時器為二(偵測計時器待下次偵測才自停; changeTableTags之派發計時器, genEmit以evEmitDelay排程1ms), 釋放後皆須清除; 修前只清除派發計時器(差1)
        let { s, of, tr } = mkServer()
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        s.updateTableTag('A')
        await tr.wait((e) => e.type === 'flush')
        let nOpen = activeTimers()
        s.clearSync()
        let nClosed = activeTimers()
        assert.strict.equal(nOpen - nClosed, 2)
        await fence() //已排程之派發於釋放時取消, 柵欄完成時若仍派發其已在此之前
        assert.strict.deepEqual(of('changeTableTags'), [])
    })

    it('S23d 從未排入任務時clearSync不留計時器, 重複呼叫無妨', async function() {
        //規格R7: cancel於無待執行任務(偵測計時器未啟動)時呼叫無妨, clearSync兩端冪等
        let n0 = await baselineTimers()
        let { s } = mkServer()
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        assert.strict.equal(activeTimers(), n0)
        s.clearSync()
        s.clearSync()
        assert.strict.equal(activeTimers(), n0)
    })

    it('S24 於onTrace之queued回調內呼叫clearSync: 此次排入之任務與偵測計時器一併取消, 待寫之時間戳由clearSync落檔', async function() {
        //規格(onTrace JSDoc): queued為「updateTableTag已接受並排入合併佇列」, 故於排入之後才通知; 回調內釋放時cancel才取消得到此次排入之任務(若先通知再排入, 釋放後偵測計時器重新啟動而存活至屆滿)
        let n0 = await baselineTimers()
        let fp = fpOf()
        let tr = traceRec()
        let s = null
        s = new WSyncWebdataServer(w.evem(), {
            fpTableTags: fp,
            genTag: () => 't1',
            onTrace: (e) => {
                tr.on(e)
                if (e.type === 'queued') {
                    s.clearSync()
                }
            },
        })
        let seen = []
        s.on('changeTableTags', (msg) => {
            seen.push(msg)
        })
        s.on('error', (msg) => {
            seen.push(msg)
        })
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        s.updateTableTag('A')
        assert.strict.equal(activeTimers(), n0)
        assert.strict.deepEqual(JSON.parse(fs.readFileSync(fp, 'utf8')), { A: 't1' })
        await fence()
        assert.strict.deepEqual(seen, [])
        assert.strict.deepEqual(tr.types(), ['queued'])
    })

    it('S25 於onTrace之flush回調內呼叫clearSync(合併窗口屆滿、任務即將執行時釋放): 待寫之時間戳由clearSync落檔, 該次不再推播, 無存活計時器', async function() {
        //規格R7: 釋放後不再派發任何事件; flush回調於偵測回呼內呼叫、其後該次任務才執行, 此時cancel已清除偵測計時器, 該次任務之寫檔與推播由writeTableTags與genEmit之釋放檢查略過
        //計時器以回調內釋放前後之差值斷言(兩次量測之間不讓出, 不受他處計時器增減之影響): 此刻本實體作用中之計時器為一(正在執行回呼之偵測計時器, 派發計時器尚未排程), 釋放後須清除
        let fp = fpOf()
        let tr = traceRec()
        let s = null
        let nOpen = -1
        let nClosed = -1
        s = new WSyncWebdataServer(w.evem(), {
            fpTableTags: fp,
            genTag: () => 't1',
            onTrace: (e) => {
                tr.on(e)
                if (e.type === 'flush') {
                    nOpen = activeTimers()
                    s.clearSync()
                    nClosed = activeTimers()
                }
            },
        })
        let seen = []
        s.on('changeTableTags', (msg) => {
            seen.push(msg)
        })
        s.on('error', (msg) => {
            seen.push(msg)
        })
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        s.updateTableTag('A')
        await tr.wait((e) => e.type === 'flush') //續行時該次偵測回呼已執行完畢(含回調內之clearSync與其後該次任務)
        assert.strict.equal(nOpen - nClosed, 1)
        assert.strict.deepEqual(JSON.parse(fs.readFileSync(fp, 'utf8')), { A: 't1' })
        await fence()
        assert.strict.deepEqual(seen, [])
        assert.strict.deepEqual(tr.types(), ['queued', 'flush'])
    })

})


describe('WSyncWebdataServer opt.onTrace', function() {

    let n0 = 0

    before(async function() {
        n0 = await baselineTimers()
        fs.rmSync(fdTmp, { recursive: true, force: true })
        fs.mkdirSync(fdTmp, { recursive: true })
    })

    after(async function() {
        fs.rmSync(fdTmp, { recursive: true, force: true })
        await settleTimers(n0, 'WSyncWebdataServer opt.onTrace')
    })

    //run, 以指定之onTrace建立伺服端, 更新兩筆並等changeTableTags, 回傳結果(供各回調種類比對: 對外行為須同未傳時)
    let run = async (onTrace, withOpt = true) => {
        let fp = fpOf()
        let nt = 0
        let opt = {
            fpTableTags: fp,
            genTag: () => {
                nt++
                return `t${nt}`
            },
        }
        if (withOpt) {
            opt.onTrace = onTrace
        }
        let s = new WSyncWebdataServer(w.evem(), opt)
        let rec = traceRec()
        let errs = []
        s.on('changeTableTags', (msg) => {
            rec.on({ type: 'changeTableTags', msg: { ...msg } })
        })
        s.on('error', (msg) => {
            errs.push(msg)
        })
        s.initTableTags({ A: 'a0', B: 'b0' }, 'useInputOnly')
        s.updateTableTag('A')
        s.updateTableTag('B')
        let e = await rec.wait((x) => x.type === 'changeTableTags')
        await fence()
        return { changed: e.msg, file: JSON.parse(fs.readFileSync(fp, 'utf8')), errs }
    }

    let expected = { changed: { A: 't1', B: 't2' }, file: { A: 't1', B: 't2' }, errs: [] }

    it('P3 未傳onTrace時行為同傳入時: 寫檔與推播結果相同', async function() {
        assert.strict.deepEqual(await run(null, false), expected)
    })

    it('P3 傳入紀錄器時: 事件為凍結物件、type為固定字串、欄位為原始值, 且回調不帶接收者', async function() {
        let tr = traceRec()
        let thisValues = []
        let r = await run(function(e) {
            thisValues.push(this)
            tr.on(e)
        })
        assert.strict.deepEqual(r, expected)
        assert.strict.deepEqual(tr.events.map((e) => ({ ...e })), [
            { type: 'queued', tableName: 'A' },
            { type: 'queued', tableName: 'B' },
            { type: 'flush', dropped: 1 },
        ])
        assert.ok(tr.events.every((e) => Object.isFrozen(e)))
        assert.ok(thisValues.every((v) => v === undefined))
    })

    it('P4 回調同步拋錯時: 不中斷更新、不改變結果、不產生uncaughtException', async function() {
        let g = watchGlobal()
        let n = 0
        let r = null
        try {
            r = await run(() => {
                n++
                throw new Error('trace boom')
            })
        }
        finally {
            g.off()
        }
        assert.strict.deepEqual(r, expected)
        assert.strict.equal(n, 3) //queued、queued、flush皆呼叫過
        assert.strict.deepEqual(g.r, [])
    })

    it('P4 回調回傳rejection時: 不改變結果、不產生unhandledRejection', async function() {
        let g = watchGlobal()
        let n = 0
        let r = null
        try {
            r = await run(() => {
                n++
                return Promise.reject(new Error('trace reject'))
            })
        }
        finally {
            g.off()
        }
        assert.strict.deepEqual(r, expected)
        assert.strict.equal(n, 3)
        assert.strict.deepEqual(g.r, [])
    })

    it('P4 onTrace非函數(字串、物件、數字、null)時視同未傳', async function() {
        for (let v of ['trace', {}, 123, null]) {
            assert.strict.deepEqual(await run(v), expected)
        }
    })

    it('P4 clearSync之後不再呼叫回調(釋放後窗口屆滿亦然, 假時鐘)', async function() {
        let clock = useFakeClock(0)
        try {
            let { s, tr } = mkServer()
            s.initTableTags({ A: 'a0' }, 'useInputOnly')
            s.updateTableTag('A')
            let m = tr.mark()
            s.clearSync()
            s.updateTableTag('A')
            await clock.advance(1000)
            assert.strict.equal(tr.mark(), m)
            assert.strict.deepEqual(tr.types(), ['queued'])
        }
        finally {
            clock.restore()
        }
    })

})
