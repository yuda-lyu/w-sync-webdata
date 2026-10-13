import assert from 'assert'
import { EventEmitter } from 'events'
import w from 'wsemi'
import WSyncWebdataClient from '../src/WSyncWebdataClient.mjs'


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

//mkClient, 建立前端同步器並依序記錄各事件
let mkClient = (opt = {}, ev = null) => {
    let c = new WSyncWebdataClient(ev || w.evem(), opt)
    let evs = []
    for (let name of ['beforeUpdateTableTags', 'refreshState', 'getData', 'error', 'afterUpdateTableTags']) {
        c.on(name, (msg) => {
            evs.push({ name, msg })
        })
    }
    let of = (name) => {
        return evs.filter((v) => v.name === name).map((v) => v.msg)
    }
    return { c, evs, of }
}


describe('WSyncWebdataClient', function() {

    it('B1 正常路徑之事件順序: before、refreshState、refreshTable、getData、after; 空批次仍發before、refreshState、after', async function() {
        let { c, evs } = mkClient()
        c.setTableTags({ A: 'a0' })
        c.on('refreshTable', (input) => {
            evs.push({ name: 'refreshTable', msg: input.tableName })
            input.pm.resolve('d')
        })
        await c.updateTableTags({ A: 'a1' })
        await sleep(20)
        assert.strict.deepEqual(evs.map((v) => v.name), ['beforeUpdateTableTags', 'refreshState', 'refreshTable', 'getData', 'afterUpdateTableTags'])
        evs.length = 0
        await c.updateTableTags({ A: 'a1' })
        await sleep(20)
        assert.strict.deepEqual(evs.map((v) => v.name), ['beforeUpdateTableTags', 'refreshState', 'afterUpdateTableTags'])
        assert.strict.equal(evs[1].msg.needToRefresh, false)
    })

    it('C1 取資料成功時推進該表時間戳並發getData, 全批結算後發afterUpdateTableTags', async function() {
        let { c, of } = mkClient()
        c.setTableTags({ A: 'a0', B: 'b0' })
        c.on('refreshTable', (input) => {
            input.pm.resolve(`data-${input.timeTag}`)
        })
        await c.updateTableTags({ A: 'a1', B: 'b0' })
        await sleep(20)
        assert.strict.deepEqual(of('getData'), [{ tableName: 'A', timeTag: 'a1', data: 'data-a1' }])
        assert.strict.deepEqual(of('afterUpdateTableTags'), [{ oldTableTags: { A: 'a1', B: 'b0' }, newTableTags: { A: 'a1', B: 'b0' } }])
        assert.strict.equal(of('error').length, 0)
    })

    it('C2 某表取資料失敗時不推進該表並發一則帶tableName與timeTag之error, 他表照常, 批次不reject且照發after, 同一時間戳再送時只重拉失敗之表', async function() {
        //規格: 監聽器失敗時以pm.reject回覆(README範例之用法)
        let { c, of } = mkClient()
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
        await sleep(20)
        assert.strict.equal(r, 'resolved')
        assert.strict.deepEqual(of('error'), [{ msg: 'can not get table data: B', err: errB, tableName: 'B', timeTag: 'b1' }])
        assert.strict.deepEqual(of('getData').map((v) => v.tableName), ['A'])
        assert.strict.deepEqual(of('afterUpdateTableTags').map((v) => v.oldTableTags), [{ A: 'a1', B: 'b0' }])

        //同一時間戳再送
        reqs.length = 0
        await c.updateTableTags({ A: 'a1', B: 'b1' })
        await sleep(20)
        assert.strict.deepEqual(reqs, ['B:b1'])
    })

    it('C2 呼叫端不await亦不catch時, 批次中有表失敗不產生unhandledRejection', async function() {
        //規格: 同w-serv-webdata之WServWebdataClient.mjs:284用法(未await未catch)
        let g = watchGlobal()
        let { c } = mkClient()
        c.on('refreshTable', (input) => {
            input.pm.reject(new Error('fail'))
        })
        c.updateTableTags({ A: 'a1' })
        await sleep(50)
        g.off()
        assert.strict.deepEqual(g.r, [])
    })

    it('C3 refreshTable監聽器於回覆前同步拋錯時以該錯誤終結該表, 批次照常結束且僅發一則error', async function() {
        let g = watchGlobal()
        let { c, of } = mkClient()
        let boom = new Error('boom')
        c.on('refreshTable', () => {
            throw boom
        })
        let r = await c.updateTableTags({ A: 'a1' }).then(() => 'resolved', () => 'rejected')
        await sleep(20)
        g.off()
        assert.strict.deepEqual(g.r, [])
        assert.strict.equal(r, 'resolved')
        assert.strict.deepEqual(of('error'), [{ msg: 'can not get table data: A', err: boom, tableName: 'A', timeTag: 'a1' }])
        assert.strict.equal(of('afterUpdateTableTags').length, 1)
    })

    it('C3 refreshTable監聽器先回覆再同步拋錯時, 資料照常提交且照常通報該監聽器錯誤(恰一則)', async function() {
        let g = watchGlobal()
        let { c, of } = mkClient()
        let boom = new Error('boom after resolve')
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
            throw boom
        })
        await c.updateTableTags({ A: 'a1' })
        await sleep(20)
        g.off()
        assert.strict.deepEqual(g.r, [])
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a1'])
        assert.strict.deepEqual(of('error'), [{ msg: 'listener of event[refreshTable] error', err: boom }])
    })

    it('C3 refreshTable有多個監聽器, 前者已回覆、後者同步拋錯時, 資料照常提交並通報後者之錯誤', async function() {
        let { c, of } = mkClient()
        let boom = new Error('logger boom')
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        c.on('refreshTable', () => {
            throw boom
        })
        await c.updateTableTags({ A: 'a1' })
        await sleep(20)
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a1'])
        assert.strict.deepEqual(of('error'), [{ msg: 'listener of event[refreshTable] error', err: boom }])
    })

    it('C4 無refreshTable監聽器時終結該表並發一則error(no listener), 批次照常結束', async function() {
        let { c, of } = mkClient()
        let r = await c.updateTableTags({ A: 'a1' }).then(() => 'resolved', () => 'rejected')
        await sleep(20)
        assert.strict.equal(r, 'resolved')
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].tableName, 'A')
        assert.strict.equal(errs[0].err.message, 'no listener for event[refreshTable]')
        assert.strict.equal(of('afterUpdateTableTags').length, 1)
    })

    it('C6 同表重疊請求時較新之回應先到者提交, 較舊回應後到者捨棄(時間戳不倒退)', async function() {
        let { c, of } = mkClient()
        c.setTableTags({ A: 'a0' })
        let pms = {}
        c.on('refreshTable', (input) => {
            pms[input.timeTag] = input.pm
        })
        let p1 = c.updateTableTags({ A: 'a1' })
        await sleep(10)
        let p2 = c.updateTableTags({ A: 'a2' })
        await sleep(10)
        pms.a2.resolve('data-a2')
        await sleep(10)
        pms.a1.resolve('data-a1') //後到
        await Promise.all([p1, p2])
        await sleep(20)
        assert.strict.deepEqual(of('getData').map((v) => `${v.timeTag}:${v.data}`), ['a2:data-a2'])
        let afters = of('afterUpdateTableTags').map((v) => v.oldTableTags.A)
        assert.strict.equal(afters[afters.length - 1], 'a2')
        assert.strict.equal(of('error').length, 0)
    })

    it('C7 同表重疊請求時較舊請求之失敗不發error', async function() {
        let { c, of } = mkClient()
        c.setTableTags({ A: 'a0' })
        let pms = {}
        c.on('refreshTable', (input) => {
            pms[input.timeTag] = input.pm
        })
        c.updateTableTags({ A: 'a1' })
        await sleep(10)
        c.updateTableTags({ A: 'a2' })
        await sleep(10)
        pms.a2.resolve('data-a2')
        pms.a1.reject(new Error('late'))
        await sleep(30)
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a2'])
        assert.strict.equal(of('error').length, 0)
    })

    it('C8 同表重疊且最新請求失敗、較舊請求成功時, 提交較舊之資料並對最新請求發error', async function() {
        let { c, of } = mkClient()
        c.setTableTags({ A: 'a0' })
        let pms = {}
        c.on('refreshTable', (input) => {
            pms[input.timeTag] = input.pm
        })
        c.updateTableTags({ A: 'a1' })
        await sleep(10)
        c.updateTableTags({ A: 'a2' })
        await sleep(10)
        pms.a1.resolve('data-a1')
        pms.a2.reject(new Error('denied'))
        await sleep(30)
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
        let { c, of } = mkClient()
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
        await sleep(20)
        assert.strict.deepEqual(reqs.sort(), ['A:a2', 'B:b1'])
        assert.strict.deepEqual(of('getData').map((v) => `${v.tableName}:${v.timeTag}`).sort(), ['A:a2', 'B:b1'])
        let afters = of('afterUpdateTableTags').map((v) => v.oldTableTags)
        assert.strict.deepEqual(afters.map((v) => v.A), ['a2', 'a2', 'a2'])
        assert.strict.deepEqual(afters[afters.length - 1], { A: 'a2', B: 'b1' })
    })

    it('C14 已派發之請求被同表較新請求取代時, 其批次即結束等待, 即使該請求永不回覆', async function() {
        let { c, of } = mkClient()
        c.setTableTags({ A: 'a0' })
        c.on('refreshTable', (input) => {
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
        await sleep(10)
        let p2 = c.updateTableTags({ A: 'a2' })
        await sleep(5)
        assert.strict.equal(st1, 'resolved')
        await Promise.all([p1, p2])
        await sleep(20)
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a2'])
    })

    it('C15 新批次之目標為已提交之時間戳時, 進行中之其他時間戳請求失效且結束等待', async function() {
        let { c, of } = mkClient()
        c.setTableTags({ A: 'a0' })
        let pms = {}
        c.on('refreshTable', (input) => {
            pms[input.timeTag] = input.pm
        })
        let st1 = 'pending'
        c.updateTableTags({ A: 'a1' }).then(() => {
            st1 = 'resolved'
        })
        await sleep(10)
        await c.updateTableTags({ A: 'a0' })
        await sleep(5)
        assert.strict.equal(st1, 'resolved')
        pms.a1.resolve('data-a1') //失效之請求晚到
        await sleep(20)
        assert.strict.equal(of('getData').length, 0)
        let afters = of('afterUpdateTableTags')
        assert.strict.equal(afters[afters.length - 1].oldTableTags.A, 'a0')
    })

    it('C11 結算時之非預期錯誤轉為error, 批次不reject', async function() {
        //setTableTags傳入凍結物件時無法寫入時間戳
        let { c, of } = mkClient()
        c.setTableTags(Object.freeze({ A: 'a0' }))
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        let r = await c.updateTableTags({ A: 'a1' }).then(() => 'resolved', () => 'rejected')
        await sleep(20)
        assert.strict.equal(r, 'resolved')
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'can not save table data: A')
        assert.ok(errs[0].err instanceof TypeError)
    })

    it('B4 tableTags為null時維持既有行為(空批次, 事件之newTableTags為null, 不發error)', async function() {
        let { c, of } = mkClient()
        await c.updateTableTags(null)
        await sleep(20)
        assert.strict.deepEqual(of('beforeUpdateTableTags').map((v) => v.newTableTags), [null])
        assert.strict.deepEqual(of('afterUpdateTableTags').map((v) => v.newTableTags), [null])
        assert.strict.equal(of('error').length, 0)
    })

    it('B5 B6 tableTags為字串、陣列、數字或布林時發error且不發任何請求', async function() {
        for (let input of ['abc', ['x', 'y'], 123, true]) {
            let { c, of } = mkClient()
            let nTable = 0
            c.on('refreshTable', (x) => {
                nTable++
                x.pm.resolve('d')
            })
            await c.updateTableTags(input)
            await sleep(10)
            assert.strict.equal(nTable, 0)
            assert.strict.deepEqual(of('error').map((v) => v.msg), ['invalid tableTags'])
            assert.strict.equal(of('beforeUpdateTableTags').length, 0)
        }
    })

    it('B7 呼叫端於批次期間修改所傳物件時, 請求與after皆以入口時之內容為準', async function() {
        let { c, of } = mkClient()
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
        await sleep(20)
        assert.strict.deepEqual(reqs, ['A:a1'])
        assert.strict.deepEqual(of('beforeUpdateTableTags')[0].newTableTags, { A: 'a1', B: 'b0' })
        assert.strict.deepEqual(of('afterUpdateTableTags')[0].newTableTags, { A: 'a1', B: 'b0' })
    })

    it('K8 setTableTags之null視同{}, 非物件發error且不作用, 一般物件直接作為內部狀態', async function() {
        let { c, of } = mkClient()
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        c.setTableTags(null)
        await c.updateTableTags({ A: 'a1' })
        await sleep(20)
        assert.strict.deepEqual(of('afterUpdateTableTags')[0].oldTableTags, { A: 'a1' })
        c.setTableTags('abc')
        await sleep(10)
        assert.strict.deepEqual(of('error').map((v) => v.msg), ['invalid tableTags for setTableTags'])
        let tags = { A: 'a1' }
        c.setTableTags(tags)
        await c.updateTableTags({ A: 'a2' })
        await sleep(20)
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
        await sleep(20)
        assert.strict.equal(nTable, 0)
        assert.strict.equal(of('beforeUpdateTableTags').length, 0)
        assert.strict.equal(of('error').length, 0)
    })

    it('P3 refreshTags回覆字串時發error且不發請求', async function() {
        let { c, of } = mkClient({ pollingDelayTime: 1 })
        let nTable = 0
        c.on('refreshTags', ({ pm }) => {
            pm.resolve('abc')
        })
        c.on('refreshTable', (input) => {
            nTable++
            input.pm.resolve('d')
        })
        await c.pollingTableTags()
        await sleep(20)
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
        await sleep(20)
        assert.strict.equal(na, 2)
        assert.strict.deepEqual(a.of('error'), [{ msg: 'can not get tags data', err: boom }, { msg: 'can not get tags data', err: boom }])

        //無監聽器
        let b = mkClient({ pollingDelayTime: 1 })
        await b.c.pollingTableTags()
        await sleep(20)
        let errs = b.of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'can not get tags data')
        assert.strict.equal(errs[0].err.message, 'no listener for event[refreshTags]')

        g.off()
        assert.strict.deepEqual(g.r, [])
    })

    it('P9 輪詢進行中重入時直接返回, 不重複發refreshTags', async function() {
        let { c } = mkClient({ pollingDelayTime: 1 })
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
        })
        let p1 = c.pollingTableTags()
        await sleep(10)
        await c.pollingTableTags() //輪詢進行中之重入
        assert.strict.equal(n, 1)
        pmTags.resolve(null)
        await p1
        await c.pollingTableTags()
        assert.strict.equal(n, 2)
    })

    it('P11 輪詢等待期間已有其他時間戳被套用時, 本次回覆捨棄', async function() {
        let { c, of } = mkClient({ pollingDelayTime: 1 })
        c.setTableTags({ A: 'a0' })
        let pmTags = null
        c.on('refreshTags', ({ pm }) => {
            pmTags = pm
        })
        let reqs = []
        c.on('refreshTable', (input) => {
            reqs.push(input.timeTag)
            input.pm.resolve(`data-${input.timeTag}`)
        })
        let p = c.pollingTableTags()
        await sleep(10)
        await c.updateTableTags({ A: 'a2' }) //推播先到
        await sleep(10)
        pmTags.resolve({ A: 'a1' }) //輪詢取得之較舊快照
        await p
        await sleep(20)
        assert.strict.deepEqual(reqs, ['a2'])
        assert.strict.deepEqual(of('getData').map((v) => v.timeTag), ['a2'])
    })

    it('T1 refreshTimeout逾時時結束等待並發error, 逾時後才到之資料仍提交', async function() {
        let { c, of } = mkClient({ refreshTimeout: 30 })
        c.setTableTags({ A: 'a0' })
        let pmA = null
        c.on('refreshTable', (input) => {
            pmA = input.pm
        })
        let t0 = Date.now()
        await c.updateTableTags({ A: 'a1' })
        let dt = Date.now() - t0
        assert.ok(dt >= 25 && dt < 1000, `dt=${dt}`)
        await sleep(10)
        let errs = of('error')
        assert.strict.equal(errs.length, 1)
        assert.strict.equal(errs[0].msg, 'can not get table data: A')
        assert.strict.equal(errs[0].err.message, 'refreshTable timeout[30ms]')
        assert.strict.equal(of('afterUpdateTableTags').length, 1)
        pmA.resolve('late')
        await sleep(20)
        assert.strict.deepEqual(of('getData').map((v) => `${v.timeTag}:${v.data}`), ['a1:late'])
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
        let { c, of } = mkClient()
        let boom = new Error('boom')
        c.on('getData', () => {
            throw boom
        })
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        await c.updateTableTags({ A: 'a1' })
        await sleep(20)
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

    it('L4 無error監聽者時本套件之error改以console.error輸出', async function() {
        let st = stubConsoleError()
        try {
            let c = new WSyncWebdataClient(w.evem(), {})
            c.on('refreshTable', (input) => {
                input.pm.reject(new Error('denied'))
            })
            await c.updateTableTags({ A: 'a1' })
            await sleep(30)
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
            await sleep(30)
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
        let { c, of } = mkClient({}, ev)
        let boom = new Error('boom')
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        c.on('getData', () => {
            throw boom
        })
        await c.updateTableTags({ A: 'a1' })
        await sleep(20)
        assert.strict.deepEqual(of('error'), [{ msg: 'listener of event[getData] error', err: boom }])
    })

    it('C9 P8 clearSync時結束進行中之等待, 等待中之updateTableTags與pollingTableTags皆可結束, 且不提交結果、不派發事件', async function() {
        let { c, evs } = mkClient({ pollingDelayTime: 1 })
        let pmTable = null
        c.on('refreshTable', (input) => {
            pmTable = input.pm
        })
        c.on('refreshTags', () => {}) //不回覆
        let p1 = c.updateTableTags({ A: 'a1' })
        let p2 = c.pollingTableTags()
        await sleep(20)
        let nEvs = evs.length
        c.clearSync()
        let r = await Promise.all([p1, p2]).then(() => 'resolved', () => 'rejected')
        pmTable.resolve('late') //釋放後之回覆無效
        await sleep(20)
        assert.strict.equal(r, 'resolved')
        assert.strict.equal(evs.length, nEvs)
    })

    it('P12 clearSync時結束輪詢之強制延遲', async function() {
        let { c } = mkClient({ pollingDelayTime: 5000 })
        c.on('refreshTags', ({ pm }) => {
            pm.resolve(null)
        })
        let t0 = Date.now()
        let p = c.pollingTableTags()
        await sleep(20)
        c.clearSync()
        await p
        let dt = Date.now() - t0
        assert.ok(dt < 1000, `dt=${dt}`)
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
        await sleep(20)
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
        await sleep(20)
        assert.strict.equal(evs.length, 0)
        assert.strict.equal(nTable, 0)
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
            let { c } = mkClient({ autoPollingTableTagsForActive: true, pollingDelayTime: 1 })
            let nTags = 0
            c.on('refreshTags', ({ pm }) => {
                nTags++
                pm.resolve(null)
            })
            assert.strict.deepEqual(added.map((v) => v[0]), ['mouseover', 'touchmove'])
            added[0][1]() //模擬mouseover
            await sleep(20)
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
