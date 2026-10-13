import assert from 'assert'
import fs from 'fs'
import w from 'wsemi'
import WSyncWebdataServer from '../src/WSyncWebdataServer.mjs'


//fdTmp, 測試暫存資料夾(已列gitignore), 測完刪除; 各伺服端實體一律指定fpTableTags, 不寫預設之./tableTags.json
let fdTmp = './test/_tmp/unit-WSyncWebdataServer'

//sleep
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

//mkServer, 建立伺服端同步器並依序記錄各事件
let mkServer = (opt = {}) => {
    let fp = opt.fpTableTags || fpOf()
    let nt = 0
    let s = new WSyncWebdataServer(w.evem(), {
        fpTableTags: fp,
        genTag: opt.genTag || (() => {
            nt++
            return `t${nt}`
        }),
    })
    let evs = []
    s.on('changeTableTags', (msg) => {
        evs.push({ name: 'changeTableTags', msg: { ...msg } })
    })
    s.on('error', (msg) => {
        evs.push({ name: 'error', msg })
    })
    let of = (name) => {
        return evs.filter((v) => v.name === name).map((v) => v.msg)
    }
    let read = () => {
        return JSON.parse(fs.readFileSync(fp, 'utf8'))
    }
    return { s, fp, evs, of, read }
}


describe('WSyncWebdataServer', function() {

    before(function() {
        fs.rmSync(fdTmp, { recursive: true, force: true })
        fs.mkdirSync(fdTmp, { recursive: true })
    })

    after(function() {
        fs.rmSync(fdTmp, { recursive: true, force: true })
    })

    it('S1 S2 updateTableTag後經debounce寫檔並發一則changeTableTags, 200ms內連續更新合併為一次', async function() {
        let { s, of, read } = mkServer()
        s.initTableTags({ A: 'a0', B: 'b0' }, 'useInputOnly')
        s.updateTableTag('A')
        s.updateTableTag('B')
        await sleep(50)
        assert.strict.equal(of('changeTableTags').length, 0)
        await sleep(300)
        assert.strict.deepEqual(of('changeTableTags'), [{ A: 't1', B: 't2' }])
        assert.strict.deepEqual(read(), { A: 't1', B: 't2' })
    })

    it('S4 changeTableTags監聽器拋錯時轉為一則error, 不使行程崩潰', async function() {
        let g = watchGlobal()
        let { s, of } = mkServer()
        let boom = new Error('boom')
        s.on('changeTableTags', () => {
            throw boom
        })
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        s.updateTableTag('A')
        await sleep(350)
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
            await sleep(30)
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
        let { s, of } = mkServer({ fpTableTags: fdTmp })
        s.initTableTags({ A: 'a0' }, 'useInputOnly')
        await sleep(30)
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
        let { s, of, read } = mkServer({
            genTag: () => {
                n++
                return n === 1 ? 'a0' : BigInt(n)
            },
        })
        s.initTableTags({ A: 'x' }, 'useInputOnly')
        s.updateTableTag('A') //a0, 可序列化
        await sleep(300)
        assert.strict.deepEqual(read(), { A: 'a0' })
        s.updateTableTag('A') //BigInt, 不可序列化
        await sleep(300)
        assert.strict.deepEqual(read(), { A: 'a0' })
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'writeTableTags catch')
        assert.ok(String(errs[0].err).includes('can not serialize tableTags'))
    })

    it('S20 initTableTags與setTableTags之null視同{}, 非物件發error且不作用; updateTableTag之表名非有效字串時發error且不作用', async function() {
        let { s, of, read } = mkServer()
        s.initTableTags(null, 'useInputOnly')
        s.updateTableTag('A')
        await sleep(300)
        assert.strict.deepEqual(read(), { A: 't1' })
        s.initTableTags('abc', 'useInputOnly')
        s.setTableTags(['x'])
        s.setTableTags(null)
        s.updateTableTag(undefined)
        s.updateTableTag({})
        await sleep(300)
        assert.strict.deepEqual(read(), { A: 't1' })
        assert.strict.deepEqual(of('error').map((v) => v.msg), [
            'invalid tableTags for initTableTags',
            'invalid tableTags for setTableTags',
            'invalid tableName',
            'invalid tableName',
        ])
    })

    it('S22 無error監聽者時本套件之error改以console.error輸出', async function() {
        let st = stubConsoleError()
        try {
            let s = new WSyncWebdataServer(w.evem(), { fpTableTags: fdTmp }) //路徑為資料夾, 寫檔必失敗
            s.writeTableTags()
            await sleep(30)
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

})
