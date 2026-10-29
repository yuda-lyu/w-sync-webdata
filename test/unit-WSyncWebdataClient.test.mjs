import assert from 'assert'
import { EventEmitter } from 'events'
import w from 'wsemi'
import WSyncWebdataClient from '../src/WSyncWebdataClient.mjs'
import { traceRec, useFakeClock } from './tools/timeKit.mjs'
import { fence, within, activeTimers, baselineTimers, settleTimers } from './tools/syncKit.mjs'


//sleep, 僅供否定觀察窗(確認某事件不再發生)使用, 不作為肯定斷言之同步點; 肯定斷言一律以事件同步(waitEv、tr.wait、seen.wait、fence)
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

//mkClient, 建立前端同步器並依序記錄各事件; tr為觀察回調(onTrace)之紀錄器, rec為公開事件之紀錄器, waitEv(name, n, from)等第n個公開事件(from為rec.mark()取得之起點), seen為測試監聽器自行登記之紀錄器(refreshTable、refreshTags之監聽器內呼叫seen.on送入)
//  公開事件由本套件以1ms計時器派發, 故批次結束(await updateTableTags)之後仍須以waitEv或fence同步; 共用層不掛refreshTable、refreshTags監聽器(會改變無監聽器之路徑)
let mkClient = (opt = {}, ev = null) => {
    let tr = traceRec()
    let c = new WSyncWebdataClient(ev || w.evem(), { onTrace: tr.on, ...opt })
    let evs = []
    let rec = traceRec()
    let seen = traceRec()
    for (let name of ['beforeUpdateTableTags', 'refreshState', 'getData', 'error', 'afterUpdateTableTags']) {
        c.on(name, (msg) => {
            evs.push({ name, msg })
            rec.on({ type: name, msg })
        })
    }
    let of = (name) => {
        return evs.filter((v) => v.name === name).map((v) => v.msg)
    }
    let waitEv = (name, n = 1, from = 0) => {
        return rec.wait((e) => e.type === name, from, n)
    }
    return { c, evs, of, tr, rec, seen, waitEv }
}


describe('WSyncWebdataClient', function() {

    //測完作用中之計時器須回到測前(否則行程不會結束), 失敗時指出而非整個執行懸置
    let n0 = 0
    before(async function() {
        n0 = await baselineTimers()
    })
    after(async function() {
        await settleTimers(n0, 'WSyncWebdataClient')
    })

    it('B1 正常路徑之事件順序: before、refreshState、refreshTable、getData、after; 空批次仍發before、refreshState、after', async function() {
        let { c, evs, rec, waitEv } = mkClient()
        c.setTableTags({ A: 'a0' })
        c.on('refreshTable', (input) => {
            evs.push({ name: 'refreshTable', msg: input.tableName })
            input.pm.resolve('d')
        })
        await c.updateTableTags({ A: 'a1' })
        await waitEv('afterUpdateTableTags')
        await fence()
        assert.strict.deepEqual(evs.map((v) => v.name), ['beforeUpdateTableTags', 'refreshState', 'refreshTable', 'getData', 'afterUpdateTableTags'])
        evs.length = 0
        let m = rec.mark() //第二批次之起點(evs清空不影響rec)
        await c.updateTableTags({ A: 'a1' })
        await waitEv('afterUpdateTableTags', 1, m)
        await fence()
        assert.strict.deepEqual(evs.map((v) => v.name), ['beforeUpdateTableTags', 'refreshState', 'afterUpdateTableTags'])
        assert.strict.equal(evs[1].msg.needToRefresh, false)
    })

    it('C1 取資料成功時推進該表時間戳並發getData, 全批結算後發afterUpdateTableTags', async function() {
        let { c, of, waitEv } = mkClient()
        c.setTableTags({ A: 'a0', B: 'b0' })
        c.on('refreshTable', (input) => {
            input.pm.resolve(`data-${input.timeTag}`)
        })
        await c.updateTableTags({ A: 'a1', B: 'b0' })
        await waitEv('afterUpdateTableTags')
        await fence()
        assert.strict.deepEqual(of('getData'), [{ tableName: 'A', timeTag: 'a1', data: 'data-a1' }])
        assert.strict.deepEqual(of('afterUpdateTableTags'), [{ oldTableTags: { A: 'a1', B: 'b0' }, newTableTags: { A: 'a1', B: 'b0' } }])
        assert.strict.equal(of('error').length, 0)
    })

    it('C2 某表取資料失敗時不推進該表並發一則帶tableName與timeTag之error, 他表照常, 批次不reject且照發after, 同一時間戳再送時只重拉失敗之表', async function() {
        //規格: 監聽器失敗時以pm.reject回覆(README範例之用法)
        let { c, of, rec, waitEv } = mkClient()
        c.setTableTags({ A: 'a0', B: 'b0' })
        let reqs = []
        let errB = new Error('permission denied')
        c.on('refreshTable', (input) => {
            reqs.push(`${input.tableName}:${input.timeTag}`)
            if (input.tableName === 'B') {
                input.pm.reject(errB)
            }
            else {
                input.pm.resolve('d')
            }
        })
        let r = await c.updateTableTags({ A: 'a1', B: 'b1' }).then(() => 'resolved', () => 'rejected')
        await waitEv('afterUpdateTableTags')
        await fence()
        assert.strict.equal(r, 'resolved')
        assert.strict.deepEqual(of('error'), [{ msg: 'can not get table data: B', err: errB, tableName: 'B', timeTag: 'b1' }])
        assert.strict.deepEqual(of('getData').map((v) => v.tableName), ['A'])
        assert.strict.deepEqual(of('afterUpdateTableTags').map((v) => v.oldTableTags), [{ A: 'a1', B: 'b0' }])

        //同一時間戳再送
        reqs.length = 0
        let m = rec.mark()
        await c.updateTableTags({ A: 'a1', B: 'b1' })
        await waitEv('afterUpdateTableTags', 1, m)
        assert.strict.deepEqual(reqs, ['B:b1'])
    })

    it('C2 呼叫端不await亦不catch時, 批次中有表失敗不產生unhandledRejection', async function() {
        //規格: 同w-serv-webdata之WServWebdataClient.mjs:284用法(未await未catch)
        let g = watchGlobal()
        let { c, waitEv } = mkClient()
        c.on('refreshTable', (input) => {
            input.pm.reject(new Error('fail'))
        })
        c.updateTableTags({ A: 'a1' }) //刻意不await亦不catch
        await waitEv('afterUpdateTableTags') //批次必定結束(afterUpdateTableTags必定發出), 其間若有rejection此時已排入行程層之處理
        await fence()
        g.off()
        assert.strict.deepEqual(g.r, [])
    })

    it('C3 refreshTable監聽器於回覆前同步拋錯時以該錯誤終結該表, 批次照常結束且僅發一則error', async function() {
        let g = watchGlobal()
        let { c, of, waitEv } = mkClient()
        let boom = new Error('boom')
        c.on('refreshTable', () => {
            throw boom
        })
        let r = await c.updateTableTags({ A: 'a1' }).then(() => 'resolved', () => 'rejected')
        await waitEv('afterUpdateTableTags')
        await fence()
        g.off()
        assert.strict.deepEqual(g.r, [])
        assert.strict.equal(r, 'resolved')
        assert.strict.deepEqual(of('error'), [{ msg: 'can not get table data: A', err: boom, tableName: 'A', timeTag: 'a1' }])
        assert.strict.equal(of('afterUpdateTableTags').length, 1)
    })

    it('C3 refreshTable監聽器先回覆再同步拋錯時, 資料照常提交且照常通報該監聽器錯誤(恰一則)', async function() {
        let g = watchGlobal()
        let { c, of, waitEv } = mkClient()
        let boom = new Error('boom after resolve')
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
            throw boom
        })
        await c.updateTableTags({ A: 'a1' })
        await waitEv('afterUpdateTableTags')
        await fence()
        g.off()
        assert.strict.deepEqual(g.r, [])
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a1'])
        assert.strict.deepEqual(of('error'), [{ msg: 'listener of event[refreshTable] error', err: boom }])
    })

    it('C3 refreshTable有多個監聽器, 前者已回覆、後者同步拋錯時, 資料照常提交並通報後者之錯誤', async function() {
        let { c, of, waitEv } = mkClient()
        let boom = new Error('logger boom')
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        c.on('refreshTable', () => {
            throw boom
        })
        await c.updateTableTags({ A: 'a1' })
        await waitEv('afterUpdateTableTags')
        await fence()
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a1'])
        assert.strict.deepEqual(of('error'), [{ msg: 'listener of event[refreshTable] error', err: boom }])
    })

    it('C4 無refreshTable監聽器時終結該表並發一則error(no listener), 批次照常結束', async function() {
        let { c, of, waitEv } = mkClient()
        let r = await c.updateTableTags({ A: 'a1' }).then(() => 'resolved', () => 'rejected')
        await waitEv('afterUpdateTableTags')
        await fence()
        assert.strict.equal(r, 'resolved')
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].tableName, 'A')
        assert.strict.equal(errs[0].err.message, 'no listener for event[refreshTable]')
        assert.strict.equal(of('afterUpdateTableTags').length, 1)
    })

    it('C6 同表重疊請求時較新之回應先到者提交, 較舊回應後到者捨棄(時間戳不倒退)', async function() {
        let { c, of, seen, waitEv } = mkClient()
        c.setTableTags({ A: 'a0' })
        let pms = {}
        c.on('refreshTable', (input) => {
            pms[input.timeTag] = input.pm
            seen.on({ type: 'table', tag: input.timeTag })
        })
        let p1 = c.updateTableTags({ A: 'a1' })
        await seen.wait((e) => e.tag === 'a1')
        let p2 = c.updateTableTags({ A: 'a2' })
        await seen.wait((e) => e.tag === 'a2')
        pms.a2.resolve('data-a2')
        await waitEv('getData') //較新之回應已提交
        pms.a1.resolve('data-a1') //後到
        await Promise.all([p1, p2])
        await waitEv('afterUpdateTableTags', 2)
        await fence() //後到之回應若被提交, 其getData已排程於此柵欄之前
        assert.strict.deepEqual(of('getData').map((v) => `${v.timeTag}:${v.data}`), ['a2:data-a2'])
        let afters = of('afterUpdateTableTags').map((v) => v.oldTableTags.A)
        assert.strict.equal(afters[afters.length - 1], 'a2')
        assert.strict.equal(of('error').length, 0)
    })

    it('C7 同表重疊請求時較舊請求之失敗不發error', async function() {
        let { c, of, seen, waitEv } = mkClient()
        c.setTableTags({ A: 'a0' })
        let pms = {}
        c.on('refreshTable', (input) => {
            pms[input.timeTag] = input.pm
            seen.on({ type: 'table', tag: input.timeTag })
        })
        let p1 = c.updateTableTags({ A: 'a1' })
        await seen.wait((e) => e.tag === 'a1')
        let p2 = c.updateTableTags({ A: 'a2' })
        await seen.wait((e) => e.tag === 'a2')
        pms.a2.resolve('data-a2')
        pms.a1.reject(new Error('late'))
        await Promise.all([p1, p2])
        await waitEv('afterUpdateTableTags', 2)
        await fence() //較舊請求之失敗若被通報, 其error已排程於此柵欄之前
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a2'])
        assert.strict.equal(of('error').length, 0)
    })

    it('C8 同表重疊且最新請求失敗、較舊請求成功時, 提交較舊之資料並對最新請求發error', async function() {
        let { c, of, seen, waitEv } = mkClient()
        c.setTableTags({ A: 'a0' })
        let pms = {}
        c.on('refreshTable', (input) => {
            pms[input.timeTag] = input.pm
            seen.on({ type: 'table', tag: input.timeTag })
        })
        let p1 = c.updateTableTags({ A: 'a1' })
        await seen.wait((e) => e.tag === 'a1')
        let p2 = c.updateTableTags({ A: 'a2' })
        await seen.wait((e) => e.tag === 'a2')
        pms.a1.resolve('data-a1')
        pms.a2.reject(new Error('denied'))
        await Promise.all([p1, p2])
        await waitEv('afterUpdateTableTags', 2)
        await fence()
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a1'])
        assert.strict.deepEqual(of('error').map((v) => `${v.tableName}:${v.timeTag}`), ['A:a2'])
        let afters = of('afterUpdateTableTags')
        assert.strict.equal(afters[afters.length - 1].oldTableTags.A, 'a1')
    })

    it('C12 同表同時間戳持續重送且取資料較慢時, 資料仍於重送期間送達(不飢餓)', async function() {
        //上層每則推播皆帶全部同步表之時間戳, 大表取資料慢時同tag會持續重送
        let { c, of } = mkClient()
        c.setTableTags({ A: 'a0' })
        c.on('refreshTable', (input) => {
            setTimeout(() => {
                input.pm.resolve('d')
            }, 50)
        })
        //A類(保留sleep): 本案之規格即為「持續重送(真實時間間隔)期間資料仍送達」, 重送間隔與其後之否定窗(等待fixture更晚之50ms計時器)皆為真實時間, 非同步點
        for (let i = 0; i < 12; i++) {
            c.updateTableTags({ A: 'a1' })
            await sleep(10)
        }
        //重送期間(約120ms)應已送達
        assert.ok(of('getData').length >= 1)
        await sleep(100)
        assert.strict.equal(of('error').length, 0)
    })

    it('C13 同一時刻多則推播時, 同表只派發最新之請求, 各批次皆於資料送達後才發after', async function() {
        let { c, of, waitEv } = mkClient()
        c.setTableTags({ A: 'a0', B: 'b0' })
        let reqs = []
        c.on('refreshTable', (input) => {
            reqs.push(`${input.tableName}:${input.timeTag}`)
            setTimeout(() => {
                input.pm.resolve(`data-${input.timeTag}`)
            }, 10)
        })
        let ps = [
            c.updateTableTags({ A: 'a1', B: 'b0' }),
            c.updateTableTags({ A: 'a1', B: 'b1' }),
            c.updateTableTags({ A: 'a2', B: 'b1' }),
        ]
        await Promise.all(ps)
        await waitEv('afterUpdateTableTags', 3)
        await fence()
        assert.strict.deepEqual(reqs.sort(), ['A:a2', 'B:b1'])
        assert.strict.deepEqual(of('getData').map((v) => `${v.tableName}:${v.timeTag}`).sort(), ['A:a2', 'B:b1'])
        let afters = of('afterUpdateTableTags').map((v) => v.oldTableTags)
        assert.strict.deepEqual(afters.map((v) => v.A), ['a2', 'a2', 'a2'])
        assert.strict.deepEqual(afters[afters.length - 1], { A: 'a2', B: 'b1' })
    })

    it('C14 已派發之請求被同表較新請求取代時, 其批次即結束等待, 即使該請求永不回覆', async function() {
        let { c, of, seen, waitEv } = mkClient()
        c.setTableTags({ A: 'a0' })
        c.on('refreshTable', (input) => {
            seen.on({ type: 'table', tag: input.timeTag })
            if (input.timeTag === 'a2') {
                setTimeout(() => {
                    input.pm.resolve('data-a2')
                }, 10)
            }
            //a1永不回覆
        })
        let st1 = 'pending'
        let p1 = c.updateTableTags({ A: 'a1' }).then(() => {
            st1 = 'resolved'
        })
        await seen.wait((e) => e.tag === 'a1') //a1已派發
        let p2 = c.updateTableTags({ A: 'a2' })
        await within(p1, 'p1') //a1永不回覆, 其批次須因被取代而結束(不結束則由防懸置上限判失敗)
        assert.strict.equal(st1, 'resolved')
        await Promise.all([p1, p2])
        await waitEv('afterUpdateTableTags', 2)
        await fence()
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a2'])
    })

    it('C15 新批次之目標為已提交之時間戳時, 進行中之其他時間戳請求失效且結束等待', async function() {
        let { c, of, seen, waitEv } = mkClient()
        c.setTableTags({ A: 'a0' })
        let pms = {}
        c.on('refreshTable', (input) => {
            pms[input.timeTag] = input.pm
            seen.on({ type: 'table', tag: input.timeTag })
        })
        let st1 = 'pending'
        let p1 = c.updateTableTags({ A: 'a1' }).then(() => {
            st1 = 'resolved'
        })
        await seen.wait((e) => e.tag === 'a1') //a1已派發
        await c.updateTableTags({ A: 'a0' })
        await within(p1, 'p1') //進行中之a1請求須因失效而結束等待(不結束則由防懸置上限判失敗)
        assert.strict.equal(st1, 'resolved')
        pms.a1.resolve('data-a1') //失效之請求晚到
        await waitEv('afterUpdateTableTags', 2)
        await fence() //晚到之回應若被提交, 其getData已排程於此柵欄之前
        assert.strict.equal(of('getData').length, 0)
        let afters = of('afterUpdateTableTags')
        assert.strict.equal(afters[afters.length - 1].oldTableTags.A, 'a0')
    })

    it('C11 結算時之非預期錯誤轉為error, 批次不reject', async function() {
        //setTableTags傳入凍結物件時無法寫入時間戳
        let { c, of, waitEv } = mkClient()
        c.setTableTags(Object.freeze({ A: 'a0' }))
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        let r = await c.updateTableTags({ A: 'a1' }).then(() => 'resolved', () => 'rejected')
        await waitEv('afterUpdateTableTags')
        await fence()
        assert.strict.equal(r, 'resolved')
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'can not save table data: A')
        assert.ok(errs[0].err instanceof TypeError)
    })

    it('B4 tableTags為null時維持既有行為(空批次, 事件之newTableTags為null, 不發error)', async function() {
        let { c, of, waitEv } = mkClient()
        await c.updateTableTags(null)
        await waitEv('afterUpdateTableTags')
        await fence()
        assert.strict.deepEqual(of('beforeUpdateTableTags').map((v) => v.newTableTags), [null])
        assert.strict.deepEqual(of('afterUpdateTableTags').map((v) => v.newTableTags), [null])
        assert.strict.equal(of('error').length, 0)
    })

    it('B5 B6 tableTags為字串、陣列、數字或布林時發error且不發任何請求', async function() {
        for (let input of ['abc', ['x', 'y'], 123, true]) {
            let { c, of, waitEv } = mkClient()
            let nTable = 0
            c.on('refreshTable', (x) => {
                nTable++
                x.pm.resolve('d')
            })
            await c.updateTableTags(input)
            await waitEv('error') //不合法輸入直接發error, 不經before與after
            await fence() //確認不會再有請求或事件
            assert.strict.equal(nTable, 0)
            assert.strict.deepEqual(of('error').map((v) => v.msg), ['invalid tableTags'])
            assert.strict.equal(of('beforeUpdateTableTags').length, 0)
        }
    })

    it('B7 呼叫端於批次期間修改所傳物件時, 請求與after皆以入口時之內容為準', async function() {
        let { c, of, waitEv } = mkClient()
        c.setTableTags({ A: 'a0', B: 'b0' })
        let reqs = []
        c.on('refreshTable', (input) => {
            reqs.push(`${input.tableName}:${input.timeTag}`)
            setTimeout(() => {
                input.pm.resolve('d')
            }, 10)
        })
        let input = { A: 'a1', B: 'b0' }
        let p = c.updateTableTags(input)
        input.B = 'b9'
        await p
        await waitEv('afterUpdateTableTags')
        await fence()
        assert.strict.deepEqual(reqs, ['A:a1'])
        assert.strict.deepEqual(of('beforeUpdateTableTags')[0].newTableTags, { A: 'a1', B: 'b0' })
        assert.strict.deepEqual(of('afterUpdateTableTags')[0].newTableTags, { A: 'a1', B: 'b0' })
    })

    it('K8 setTableTags之null視同{}, 非物件發error且不作用, 一般物件直接作為內部狀態', async function() {
        let { c, of, rec, waitEv } = mkClient()
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        c.setTableTags(null)
        await c.updateTableTags({ A: 'a1' })
        await waitEv('afterUpdateTableTags')
        assert.strict.deepEqual(of('afterUpdateTableTags')[0].oldTableTags, { A: 'a1' })
        c.setTableTags('abc')
        await waitEv('error')
        await fence()
        assert.strict.deepEqual(of('error').map((v) => v.msg), ['invalid tableTags for setTableTags'])
        let tags = { A: 'a1' }
        c.setTableTags(tags)
        let m = rec.mark()
        await c.updateTableTags({ A: 'a2' })
        await waitEv('afterUpdateTableTags', 1, m)
        assert.strict.deepEqual(tags, { A: 'a2' })
    })

    it('P1 P4 pollingTableTags於成功、取時間戳失敗、取資料失敗之後皆可再次輪詢', async function() {
        //規格: isPolling於任何路徑皆須恢復
        let { c } = mkClient({ pollingDelayTime: 1 })
        let n = 0
        let mode = ''
        c.on('refreshTags', ({ pm }) => {
            n++
            if (mode === 'tagsFail') {
                pm.reject(new Error('tags fail'))
            }
            else {
                pm.resolve({ A: `a${n}` })
            }
        })
        c.on('refreshTable', (input) => {
            if (mode === 'tableFail') {
                input.pm.reject(new Error('table fail'))
            }
            else {
                input.pm.resolve('d')
            }
        })
        for (let m of ['ok', 'tagsFail', 'tableFail', 'ok']) {
            mode = m
            await c.pollingTableTags()
        }
        assert.strict.equal(n, 4)
    })

    it('P2 refreshTags回覆假值時略過更新', async function() {
        let { c, of } = mkClient({ pollingDelayTime: 1 })
        let nTable = 0
        c.on('refreshTags', ({ pm }) => {
            pm.resolve(null)
        })
        c.on('refreshTable', (input) => {
            nTable++
            input.pm.resolve('d')
        })
        await c.pollingTableTags()
        await fence() //確認不會再有請求或事件(輪詢已結束, 其前排程之事件皆已派發)
        assert.strict.equal(nTable, 0)
        assert.strict.equal(of('beforeUpdateTableTags').length, 0)
        assert.strict.equal(of('error').length, 0)
    })

    it('P3 refreshTags回覆字串時發error且不發請求', async function() {
        let { c, of, waitEv } = mkClient({ pollingDelayTime: 1 })
        let nTable = 0
        c.on('refreshTags', ({ pm }) => {
            pm.resolve('abc')
        })
        c.on('refreshTable', (input) => {
            nTable++
            input.pm.resolve('d')
        })
        await c.pollingTableTags()
        await waitEv('error')
        await fence()
        assert.strict.equal(nTable, 0)
        assert.strict.deepEqual(of('error').map((v) => v.msg), ['invalid tableTags'])
    })

    it('P5 P6 refreshTags監聽器拋錯或無監聽器時發一則error且可再次輪詢', async function() {
        let g = watchGlobal()

        //監聽器拋錯
        let a = mkClient({ pollingDelayTime: 1 })
        let boom = new Error('boom')
        let na = 0
        a.c.on('refreshTags', () => {
            na++
            throw boom
        })
        await a.c.pollingTableTags()
        await a.c.pollingTableTags()
        await a.waitEv('error', 2)
        await fence()
        assert.strict.equal(na, 2)
        assert.strict.deepEqual(a.of('error'), [{ msg: 'can not get tags data', err: boom }, { msg: 'can not get tags data', err: boom }])

        //無監聽器
        let b = mkClient({ pollingDelayTime: 1 })
        await b.c.pollingTableTags()
        await b.waitEv('error')
        await fence()
        let errs = b.of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'can not get tags data')
        assert.strict.equal(errs[0].err.message, 'no listener for event[refreshTags]')

        g.off()
        assert.strict.deepEqual(g.r, [])
    })

    it('P9 輪詢進行中重入時直接返回, 不重複發refreshTags', async function() {
        let { c, seen } = mkClient({ pollingDelayTime: 1 })
        let n = 0
        let pmTags = null
        c.on('refreshTags', ({ pm }) => {
            n++
            if (n === 1) {
                pmTags = pm //第一次暫不回覆
            }
            else {
                pm.resolve(null)
            }
            seen.on({ type: 'tags', n })
        })
        let p1 = c.pollingTableTags()
        await seen.wait((e) => e.type === 'tags') //第一次refreshTags已派發
        await c.pollingTableTags() //輪詢進行中之重入
        assert.strict.equal(n, 1)
        pmTags.resolve(null)
        await p1
        await c.pollingTableTags()
        assert.strict.equal(n, 2)
    })

    it('P11 輪詢等待期間已有其他時間戳被套用時, 本次回覆捨棄', async function() {
        let { c, of, seen, waitEv } = mkClient({ pollingDelayTime: 1 })
        c.setTableTags({ A: 'a0' })
        let pmTags = null
        c.on('refreshTags', ({ pm }) => {
            pmTags = pm
            seen.on({ type: 'tags' })
        })
        let reqs = []
        c.on('refreshTable', (input) => {
            reqs.push(input.timeTag)
            input.pm.resolve(`data-${input.timeTag}`)
        })
        let p = c.pollingTableTags()
        await seen.wait((e) => e.type === 'tags') //refreshTags已派發, 輪詢等待回覆中
        await c.updateTableTags({ A: 'a2' }) //推播先到
        await waitEv('afterUpdateTableTags')
        pmTags.resolve({ A: 'a1' }) //輪詢取得之較舊快照
        await p
        await fence() //較舊快照若被套用, 其請求與事件已排程於此柵欄之前
        assert.strict.deepEqual(reqs, ['a2'])
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a2'])
    })

    it('T1 refreshTimeout逾時時結束等待並發error, 逾時後才到之資料仍提交', async function() {
        //「延遲30ms」之規格本身由假時鐘案T1b驗證, 本案只驗逾時之語意(以觀察回調之timeout事件同步, 不量牆鐘時間)
        let { c, of, tr, waitEv } = mkClient({ refreshTimeout: 30 })
        c.setTableTags({ A: 'a0' })
        let pmA = null
        c.on('refreshTable', (input) => {
            pmA = input.pm
        })
        await c.updateTableTags({ A: 'a1' })
        let te = await tr.wait((e) => e.type === 'timeout')
        assert.strict.deepEqual({ ...te }, { type: 'timeout', target: 'table', tableName: 'A', timeTag: 'a1', ms: 30, reported: true })
        await waitEv('afterUpdateTableTags')
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'can not get table data: A')
        assert.strict.equal(errs[0].err.message, 'refreshTable timeout[30ms]')
        assert.strict.equal(of('afterUpdateTableTags').length, 1)
        pmA.resolve('late')
        await waitEv('getData')
        assert.strict.deepEqual(of('getData').map((v) => `${v.timeTag}:${v.data}`), ['a1:late'])
    })

    it('T1c refreshTimeout逾時時, 該時間戳已於他處提交(setTableTags)者只結束等待而不發error, timeout事件之reported為false', async function() {
        //規格R10/R11: 逾時只結束等待並發error; reported為是否因此發error, 時間戳已由他處提交者無錯可報
        let { c, of, tr, seen, waitEv } = mkClient({ refreshTimeout: 30 })
        c.setTableTags({ A: 'a0' })
        c.on('refreshTable', (input) => {
            seen.on({ type: 'table', tag: input.timeTag }) //不回覆
        })
        let p = c.updateTableTags({ A: 'a1' })
        await seen.wait((e) => e.tag === 'a1') //已派發, 等待上限自此起算
        c.setTableTags({ A: 'a1' }) //他處已提交該時間戳
        let te = await tr.wait((e) => e.type === 'timeout')
        assert.strict.deepEqual({ ...te }, { type: 'timeout', target: 'table', tableName: 'A', timeTag: 'a1', ms: 30, reported: false })
        await within(p, 'p') //逾時結束等待
        await waitEv('afterUpdateTableTags')
        await fence() //若逾時仍發error, 其已排程於此柵欄之前
        assert.strict.equal(of('error').length, 0)
        assert.strict.equal(of('afterUpdateTableTags').length, 1)
    })

    it('T2 refreshTimeout於refreshTags不回覆時發error, 之後可再次輪詢', async function() {
        let { c, of } = mkClient({ refreshTimeout: 30, pollingDelayTime: 1 })
        let n = 0
        c.on('refreshTags', () => {
            n++
        })
        await c.pollingTableTags()
        await c.pollingTableTags()
        assert.strict.equal(n, 2)
        assert.strict.deepEqual(of('error').map((v) => v.err.message), ['refreshTags timeout[30ms]', 'refreshTags timeout[30ms]'])
    })

    it('L1 一般事件之監聽器拋錯時轉為一則error事件, 不使行程崩潰', async function() {
        let g = watchGlobal()
        let { c, of, waitEv } = mkClient()
        let boom = new Error('boom')
        c.on('getData', () => {
            throw boom
        })
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        await c.updateTableTags({ A: 'a1' })
        await waitEv('afterUpdateTableTags')
        await fence()
        g.off()
        assert.strict.deepEqual(g.r, [])
        assert.strict.deepEqual(of('error'), [{ msg: 'listener of event[getData] error', err: boom }])
    })

    it('L2 error監聽器拋錯時以console.error輸出且不遞迴, 不使行程崩潰', async function() {
        let g = watchGlobal()
        let st = stubConsoleError()
        let n = 0
        try {
            let c = new WSyncWebdataClient(w.evem(), {})
            c.on('error', () => {
                n++
                throw new Error('error listener boom')
            })
            await c.updateTableTags({ A: 'a1' }) //無refreshTable監聽器, 產生一則error
            await fence() //error與after已排程於此柵欄之前, 派發當下即同步呼叫console.error
        }
        finally {
            st.restore()
            g.off()
        }
        assert.strict.deepEqual(g.r, [])
        assert.strict.equal(n, 1)
        assert.strict.equal(st.logs.length, 1)
    })

    it('L4 無error監聽者時本套件之error改以console.error輸出', async function() {
        let st = stubConsoleError()
        try {
            let c = new WSyncWebdataClient(w.evem(), {})
            c.on('refreshTable', (input) => {
                input.pm.reject(new Error('denied'))
            })
            await c.updateTableTags({ A: 'a1' })
            await fence() //error已排程於此柵欄之前, 派發當下即同步呼叫console.error
        }
        finally {
            st.restore()
        }
        assert.strict.equal(st.logs.length, 1)
        assert.strict.equal(st.logs[0][0], '[w-sync-webdata]')
        assert.strict.equal(st.logs[0][1].msg, 'can not get table data: A')
    })

    it('N2 事件物件為Node之EventEmitter且無error監聽者時, 失敗不使行程崩潰', async function() {
        let g = watchGlobal()
        let st = stubConsoleError()
        let r = ''
        try {
            let c = new WSyncWebdataClient(new EventEmitter(), {})
            c.on('refreshTable', (input) => {
                input.pm.reject(new Error('denied'))
            })
            r = await c.updateTableTags({ A: 'a1' }).then(() => 'resolved', () => 'rejected')
            await fence() //error已排程於此柵欄之前, 派發當下即同步呼叫console.error
        }
        finally {
            st.restore()
            g.off()
        }
        assert.strict.deepEqual(g.r, [])
        assert.strict.equal(r, 'resolved')
        assert.strict.equal(st.logs.length, 1)
    })

    it('N3 事件物件僅提供emit與on(無listenerCount)時, 監聽器錯誤仍以error事件通報', async function() {
        let ee = w.evem()
        let ev = {
            emit: (...args) => ee.emit(...args),
            on: (...args) => ee.on(...args),
        }
        let { c, of, waitEv } = mkClient({}, ev)
        let boom = new Error('boom')
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        c.on('getData', () => {
            throw boom
        })
        await c.updateTableTags({ A: 'a1' })
        await waitEv('afterUpdateTableTags')
        await fence()
        assert.strict.deepEqual(of('error'), [{ msg: 'listener of event[getData] error', err: boom }])
    })

    it('C9 P8 clearSync時結束進行中之等待, 等待中之updateTableTags與pollingTableTags皆可結束, 且不提交結果、不派發事件', async function() {
        let { c, evs, seen } = mkClient({ pollingDelayTime: 1 })
        let pmTable = null
        c.on('refreshTable', (input) => {
            pmTable = input.pm
            seen.on({ type: 'table' })
        })
        c.on('refreshTags', () => {
            seen.on({ type: 'tags' })
        }) //不回覆
        let p1 = c.updateTableTags({ A: 'a1' })
        let p2 = c.pollingTableTags()
        await seen.wait((e) => e.type === 'table') //兩個等待皆已就緒(其前之beforeUpdateTableTags、refreshState亦已派發)
        await seen.wait((e) => e.type === 'tags')
        let nEvs = evs.length
        c.clearSync()
        let r = await Promise.all([p1, p2]).then(() => 'resolved', () => 'rejected')
        pmTable.resolve('late') //釋放後之回覆無效
        await fence() //釋放後若仍有事件被排程, 其已排程於此柵欄之前
        assert.strict.equal(r, 'resolved')
        assert.strict.equal(evs.length, nEvs)
    })

    it('P12 clearSync時結束輪詢之強制延遲', async function() {
        let { c, tr } = mkClient({ pollingDelayTime: 5000 })
        c.on('refreshTags', ({ pm }) => {
            pm.resolve(null)
        })
        let p = c.pollingTableTags()
        let ds = await tr.wait((e) => e.type === 'delayStart') //強制延遲(5000ms)已開始
        assert.strict.deepEqual({ ...ds }, { type: 'delayStart', ms: 5000 })
        c.clearSync()
        await within(p, 'p') //延遲被提前結束, 輪詢隨即結束(不結束則由防懸置上限判失敗)
        assert.ok(tr.events.some((e) => e.type === 'delayEnd' && e.reason === 'cleared'))
        assert.ok(!tr.events.some((e) => e.reason === 'elapsed'))
    })

    it('K2 K3 K4 K5 clearSync後各函數不作用、不派發事件, 且可重複呼叫', async function() {
        let { c, evs } = mkClient({ pollingDelayTime: 1 })
        let nTable = 0
        let nTags = 0
        c.on('refreshTable', (input) => {
            nTable++
            input.pm.resolve('d')
        })
        c.on('refreshTags', ({ pm }) => {
            nTags++
            pm.resolve({ A: 'a1' })
        })
        c.clearSync()
        c.clearSync()
        c.setTableTags({ A: 'x' })
        await c.updateTableTags({ A: 'a1' })
        await c.pollingTableTags()
        await fence() //確認不會再有事件(其前已排程者皆已派發)
        assert.strict.equal(nTable, 0)
        assert.strict.equal(nTags, 0)
        assert.strict.equal(evs.length, 0)
    })

    it('K6 clearSync前已排程之事件不再派發', async function() {
        let { c, evs } = mkClient()
        let nTable = 0
        c.on('refreshTable', (input) => {
            nTable++
            input.pm.resolve('d')
        })
        c.updateTableTags({ A: 'a1' }) //beforeUpdateTableTags、refreshState、refreshTable已排程(1ms後派發)
        c.clearSync()
        await fence() //clearSync前已排程之事件若仍派發, 其已排程於此柵欄之前
        assert.strict.equal(evs.length, 0)
        assert.strict.equal(nTable, 0)
    })

    it('K7 clearSync取消已排程之派發: 釋放完成後作用中之計時器數回到釋放前(同步量測, 負載下亦同)', async function() {
        //規格(clearSync JSDoc): 取消已排程之事件. 派發時雖以isCleared略過, 已排程之1ms計時器仍須一併取消, 否則釋放後計時器仍存活
        let { c } = mkClient()
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        let n0 = activeTimers()
        let p = c.updateTableTags({ A: 'a1' }) //同步段已排程beforeUpdateTableTags、refreshState、refreshTable之派發
        assert.ok(activeTimers() > n0, '量測有效: 排程後作用中之計時器數增加')
        c.clearSync()
        assert.strict.equal(activeTimers(), n0)
        await within(p, 'p')
    })

    it('K7b clearSync結束輪詢之強制延遲: 釋放完成後該延遲之計時器(5000ms)已取消', async function() {
        //規格(clearSync JSDoc): 結束輪詢之等待與延遲; 延遲計時器未取消時, 其事件雖不再通知, 計時器仍存活至屆滿
        let { c, tr } = mkClient({ pollingDelayTime: 5000 })
        c.on('refreshTags', ({ pm }) => {
            pm.resolve(null)
        })
        let p = c.pollingTableTags()
        await tr.wait((e) => e.type === 'delayStart') //延遲計時器已建立(續行為microtask, 與量測之間不讓出事件迴圈)
        let n1 = activeTimers()
        c.clearSync()
        assert.strict.equal(n1 - activeTimers(), 1)
        await within(p, 'p')
    })

    it('K7c clearSync結束進行中請求之等待: 釋放完成後refreshTimeout之等待上限計時器(60000ms)已取消', async function() {
        let { c, seen } = mkClient({ refreshTimeout: 60000 })
        c.setTableTags({ A: 'a0' })
        c.on('refreshTable', (input) => {
            seen.on({ type: 'table', tag: input.timeTag }) //不回覆
        })
        let p = c.updateTableTags({ A: 'a1' })
        await seen.wait((e) => e.tag === 'a1') //已派發, 等待上限之計時器已建立
        let n1 = activeTimers()
        c.clearSync()
        assert.strict.equal(n1 - activeTimers(), 1)
        await within(p, 'p')
    })

    it('K1 autoPollingTableTagsForActive於使用者活動時輪詢, clearSync時移除window監聽', async function() {
        let added = []
        let removed = []
        globalThis.window = {
            document: {},
            addEventListener: (type, fn) => {
                added.push([type, fn])
            },
            removeEventListener: (type, fn) => {
                removed.push([type, fn])
            },
        }
        try {
            let { c, seen } = mkClient({ autoPollingTableTagsForActive: true, pollingDelayTime: 1 })
            let nTags = 0
            c.on('refreshTags', ({ pm }) => {
                nTags++
                pm.resolve(null)
                seen.on({ type: 'tags' })
            })
            assert.strict.deepEqual(added.map((v) => v[0]), ['mouseover', 'touchmove'])
            added[0][1]() //模擬mouseover
            await seen.wait((e) => e.type === 'tags') //輪詢已發出refreshTags
            assert.strict.equal(nTags, 1)
            c.clearSync()
            assert.strict.deepEqual(removed.map((v) => v[0]), ['mouseover', 'touchmove'])
            assert.strict.equal(removed[0][1], added[0][1])
            assert.strict.equal(removed[1][1], added[1][1])
        }
        finally {
            delete globalThis.window
        }
    })

})


describe('WSyncWebdataClient opt.onTrace', function() {

    //測完作用中之計時器須回到測前(否則行程不會結束), 失敗時指出而非整個執行懸置
    let n0 = 0
    before(async function() {
        n0 = await baselineTimers()
    })
    after(async function() {
        await settleTimers(n0, 'WSyncWebdataClient opt.onTrace')
    })

    //run, 以指定之onTrace建立前端同步器並輪詢一次(取時間戳、取資料、強制延遲1ms), 回傳結果(供各回調種類比對: 對外行為須同未傳時)
    let run = async (onTrace, withOpt = true) => {
        let opt = { pollingDelayTime: 1 }
        if (withOpt) {
            opt.onTrace = onTrace
        }
        let c = new WSyncWebdataClient(w.evem(), opt)
        let rec = traceRec()
        let errs = []
        c.on('refreshTags', ({ pm }) => {
            pm.resolve({ A: 'a1' })
        })
        c.on('refreshTable', (input) => {
            input.pm.resolve(`data-${input.timeTag}`)
        })
        c.on('getData', (msg) => {
            rec.on({ type: 'getData', msg })
        })
        c.on('error', (msg) => {
            errs.push(msg)
        })
        await c.pollingTableTags()
        let e = await rec.wait((x) => x.type === 'getData')
        await fence()
        return { getData: e.msg, errs }
    }

    let expected = { getData: { tableName: 'A', timeTag: 'a1', data: 'data-a1' }, errs: [] }

    it('T1b refreshTimeout之等待上限為30ms: 派發後滿29ms尚未逾時, 滿30ms逾時(假時鐘)', async function() {
        let clock = useFakeClock(0)
        try {
            let { c, tr, seen } = mkClient({ refreshTimeout: 30 })
            c.setTableTags({ A: 'a0' })
            c.on('refreshTable', (input) => {
                seen.on({ type: 'table', tag: input.timeTag }) //不回覆
            })
            let p = c.updateTableTags({ A: 'a1' })
            await clock.advance(1) //1ms後完成派發, 等待上限自此起算
            await seen.wait((e) => e.tag === 'a1')
            await clock.advance(29)
            assert.strict.deepEqual(tr.types(), [])
            await clock.advance(1)
            let te = await tr.wait((e) => e.type === 'timeout')
            assert.strict.deepEqual({ ...te }, { type: 'timeout', target: 'table', tableName: 'A', timeTag: 'a1', ms: 30, reported: true })
            assert.strict.deepEqual(tr.types(), ['timeout'])
            await within(p, 'p')
        }
        finally {
            clock.restore()
        }
    })

    it('T2b refreshTimeout於refreshTags不回覆時: 滿30ms發tags之timeout事件, 之後強制延遲依序開始與屆滿(假時鐘)', async function() {
        let clock = useFakeClock(0)
        try {
            let { c, of, tr, seen, waitEv } = mkClient({ refreshTimeout: 30, pollingDelayTime: 1 })
            c.on('refreshTags', () => {
                seen.on({ type: 'tags' }) //不回覆
            })
            let p = c.pollingTableTags()
            await clock.advance(1)
            await seen.wait((e) => e.type === 'tags')
            await clock.advance(28)
            assert.strict.deepEqual(tr.types(), [])
            await clock.advance(1)
            let te = await tr.wait((e) => e.type === 'timeout')
            assert.strict.deepEqual({ ...te }, { type: 'timeout', target: 'tags', ms: 30 })
            let ds = await tr.wait((e) => e.type === 'delayStart')
            assert.strict.deepEqual({ ...ds }, { type: 'delayStart', ms: 1 })
            await clock.advance(2)
            let de = await tr.wait((e) => e.type === 'delayEnd')
            assert.strict.deepEqual({ ...de }, { type: 'delayEnd', reason: 'elapsed' })
            assert.strict.deepEqual(tr.types(), ['timeout', 'delayStart', 'delayEnd'])
            await within(p, 'p')
            await waitEv('error')
            assert.strict.deepEqual(of('error').map((v) => v.err.message), ['refreshTags timeout[30ms]'])
        }
        finally {
            clock.restore()
        }
    })

    it('D1 pollingDelayTime為500ms: 強制延遲開始後滿499ms尚未結束, 滿500ms結束(假時鐘)', async function() {
        let clock = useFakeClock(0)
        try {
            let { c, tr } = mkClient({ pollingDelayTime: 500 })
            c.on('refreshTags', ({ pm }) => {
                pm.resolve(null)
            })
            let p = c.pollingTableTags()
            await clock.advance(1) //1ms後完成派發refreshTags, 回覆後即進入強制延遲
            let ds = await tr.wait((e) => e.type === 'delayStart')
            assert.strict.deepEqual({ ...ds }, { type: 'delayStart', ms: 500 })
            await clock.advance(499)
            assert.strict.deepEqual(tr.types(), ['delayStart'])
            await clock.advance(1)
            let de = await tr.wait((e) => e.type === 'delayEnd')
            assert.strict.deepEqual({ ...de }, { type: 'delayEnd', reason: 'elapsed' })
            await within(p, 'p')
            assert.strict.deepEqual(tr.types(), ['delayStart', 'delayEnd'])
        }
        finally {
            clock.restore()
        }
    })

    it('C16 refreshTimeout計時器於請求先完成時不再通報(計時器已被清除)', async function() {
        let clock = useFakeClock(0)
        try {
            let { c, of, tr, waitEv } = mkClient({ refreshTimeout: 30 })
            c.setTableTags({ A: 'a0' })
            c.on('refreshTable', (input) => {
                input.pm.resolve('d') //派發後立即回覆
            })
            let p = c.updateTableTags({ A: 'a1' })
            await clock.advance(5) //派發、getData、afterUpdateTableTags皆已完成
            await within(p, 'p')
            await waitEv('afterUpdateTableTags')
            assert.strict.deepEqual(of('getData').map((v) => `${v.timeTag}:${v.data}`), ['a1:d'])
            await clock.advance(1000) //遠逾30ms
            assert.strict.deepEqual(tr.types(), [])
            assert.strict.equal(of('error').length, 0)
        }
        finally {
            clock.restore()
        }
    })

    it('T2c refreshTags於等待上限內先回覆時, 等待上限計時器已清除而不再通報(假時鐘)', async function() {
        let clock = useFakeClock(0)
        try {
            let { c, of, tr } = mkClient({ refreshTimeout: 30, pollingDelayTime: 1 })
            c.on('refreshTags', ({ pm }) => {
                pm.resolve(null) //派發後立即回覆
            })
            let p = c.pollingTableTags()
            await clock.advance(5) //派發、回覆、強制延遲(1ms)皆已完成
            await within(p, 'p')
            await clock.advance(1000) //遠逾30ms
            assert.strict.deepEqual(tr.types(), ['delayStart', 'delayEnd'])
            assert.strict.equal(of('error').length, 0)
        }
        finally {
            clock.restore()
        }
    })

    it('P3 未傳onTrace時行為同傳入時: 輪詢與取資料結果相同', async function() {
        assert.strict.deepEqual(await run(null, false), expected)
    })

    it('P3 傳入紀錄器時: 事件為凍結物件、type為固定字串、欄位為原始值, 事件序列為delayStart、delayEnd(elapsed), 且回調不帶接收者', async function() {
        let tr = traceRec()
        let thisValues = []
        let r = await run(function(e) {
            thisValues.push(this)
            tr.on(e)
        })
        assert.strict.deepEqual(r, expected)
        assert.strict.deepEqual(tr.events.map((e) => ({ ...e })), [
            { type: 'delayStart', ms: 1 },
            { type: 'delayEnd', reason: 'elapsed' },
        ])
        assert.ok(tr.events.every((e) => Object.isFrozen(e)))
        assert.strict.equal(thisValues.length, 2)
        assert.ok(thisValues.every((v) => v === undefined))
    })

    it('P4 回調同步拋錯時: 不中斷輪詢、不改變結果、不產生uncaughtException', async function() {
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
        assert.strict.equal(n, 2) //delayStart、delayEnd皆呼叫過
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
        assert.strict.equal(n, 2)
        assert.strict.deepEqual(g.r, [])
    })

    it('P4 onTrace非函數(字串、物件、數字、null)時視同未傳', async function() {
        for (let v of ['trace', {}, 123, null]) {
            assert.strict.deepEqual(await run(v), expected)
        }
    })

    it('P4 clearSync之後不再呼叫回調(延遲中釋放, 其後延遲屆滿之時間亦然, 假時鐘)', async function() {
        let clock = useFakeClock(0)
        try {
            let { c, tr } = mkClient({ pollingDelayTime: 5000 })
            c.on('refreshTags', ({ pm }) => {
                pm.resolve(null)
            })
            let p = c.pollingTableTags()
            await clock.advance(1)
            await tr.wait((e) => e.type === 'delayStart')
            c.clearSync() //'cleared'於clearSync呼叫期間同步發出
            let m = tr.mark()
            await within(p, 'p')
            await c.pollingTableTags() //釋放後各函數不作用
            await c.updateTableTags({ A: 'a1' })
            await clock.advance(6000) //遠逾原延遲
            assert.strict.equal(tr.mark(), m)
            assert.strict.deepEqual(tr.events.map((e) => ({ ...e })), [
                { type: 'delayStart', ms: 5000 },
                { type: 'delayEnd', reason: 'cleared' },
            ])
        }
        finally {
            clock.restore()
        }
    })

})
