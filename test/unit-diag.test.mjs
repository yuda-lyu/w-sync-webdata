import assert from 'assert'
import fs from 'fs'
import { inspect } from 'util'
import w from 'wsemi'
import WSyncWebdataClient from '../src/WSyncWebdataClient.mjs'
import WSyncWebdataServer from '../src/WSyncWebdataServer.mjs'
import { fence, within, baselineTimers, settleTimers } from './tools/syncKit.mjs'


//診斷輸出測試(規則見sgud/rule/rulebook.md之R12, 排程第158項): 本套件自發之error於無error監聽者時, console預設只出固定標籤與安全摘要({errType, errCode}),
//不含錯誤訊息、表名、時間戳與被拒收之輸入值; opt.logDetail===true還原遮罩後之細節; opt.funLog(label, safe, detail)取代console
//各站點之輸入皆夾帶哨兵字串SENT, 斷言預設輸出之全文不含SENT, 且logDetail與funLog之細節含SENT(細節可取)


//fdTmp, 測試暫存資料夾(已列gitignore), 測完刪除
let fdTmp = './test/_tmp/unit-diag'

//SENT, 哨兵字串, 代表權杖、使用者識別、表名等不該出現於預設輸出之值
const SENT = 'SECRET-9f3a1c'

//LABEL0, 本套件之固定標籤前綴(與src/genEmit.mjs之tag一致)
const LABEL0 = '[w-sync-webdata]'

//stubConsole, 暫時接管console各輸出方法, 記錄{ m, args }
let stubConsole = () => {
    let ms = ['log', 'info', 'warn', 'error', 'debug']
    let saved = {}
    let calls = []
    for (let m of ms) {
        saved[m] = console[m]
        console[m] = (...args) => {
            calls.push({ m, args })
        }
    }
    let restore = () => {
        for (let m of ms) {
            console[m] = saved[m]
        }
    }
    return { calls, restore }
}

//dump, 全文(含Error之訊息與堆疊、巢狀物件)
let dump = (v) => {
    return inspect(v, { depth: 30, breakLength: Infinity })
}

//assertSafe, safe為只含errType與errCode之純物件
let assertSafe = (safe, site) => {
    assert.strict.equal(Object.getPrototypeOf(safe), Object.prototype)
    for (let k of Object.keys(safe)) {
        assert.ok(k === 'errType' || k === 'errCode', `safe has unexpected key: ${k}`)
    }
    assert.strict.equal(safe.errType, site.errType)
    if (site.marker) {
        assert.strict.equal(safe.errCode, site.marker) //fs站點之錯誤代碼(系統錯誤名)入摘要
    }
}

//assertDefault, 預設輸出: 一則console.error(固定標籤, 安全摘要), 全文不含哨兵
let assertDefault = (calls, site) => {
    assert.ok(!dump(calls).includes(SENT), `default output leaks: ${dump(calls).slice(0, 400)}`) //最先檢查: 不論標籤與形狀, 預設輸出不得含哨兵
    assert.strict.equal(calls.length, 1, dump(calls))
    assert.strict.equal(calls[0].m, 'error')
    assert.strict.equal(calls[0].args.length, 2)
    assert.strict.equal(calls[0].args[0], `${LABEL0} ${site.label}`)
    assertSafe(calls[0].args[1], site)
}

//assertDetail, 細節: 一則console.error(固定標籤, 細節), 細節為完整之error內容(含哨兵)
let assertDetail = (calls, site) => {
    assert.strict.equal(calls.length, 1, dump(calls))
    assert.strict.equal(calls[0].m, 'error')
    assert.strict.equal(calls[0].args.length, 2)
    assert.strict.equal(calls[0].args[0], `${LABEL0} ${site.label}`)
    let d = calls[0].args[1]
    assert.ok(d !== null && typeof d === 'object')
    assert.ok(typeof d.msg === 'string' && d.msg.startsWith(site.label), dump(d))
    assert.ok(dump(d).includes(site.marker || SENT), `detail lost: ${dump(d)}`)
}

//assertFunLog, funLog: console不寫, funLog收到一次(固定標籤, 安全摘要, 細節), 安全摘要不含哨兵, 細節為完整之error內容
let assertFunLog = (calls, fl, site) => {
    assert.strict.equal(calls.length, 0, dump(calls))
    assert.strict.equal(fl.length, 1)
    assert.strict.equal(fl[0][0], `${LABEL0} ${site.label}`)
    assertSafe(fl[0][1], site)
    assert.ok(!dump(fl[0][1]).includes(SENT))
    assert.ok(fl[0][2].msg.startsWith(site.label) && dump(fl[0][2]).includes(site.marker || SENT), dump(fl[0][2]))
}

//runWith, 於接管console之下建立同步器、執行情境、柵欄等候已排程之事件、釋放, 回傳console紀錄與funLog紀錄
let runWith = async (Cls, inst, opt, scenario, id) => {
    let st = stubConsole()
    let fl = []
    let o = { ...opt }
    if (o.funLog === true) {
        o.funLog = (...args) => {
            fl.push(args)
        }
    }
    let x = null
    try {
        x = new Cls(inst(), o)
        await within(Promise.resolve(scenario(x)), id)
        await fence()
    }
    finally {
        if (x) {
            x.clearSync()
        }
        st.restore()
    }
    return { calls: st.calls, fl }
}


//clientSites, 前端各error站點(盤點: git grep -n --untracked "eeEmit('error'" -- src/WSyncWebdataClient.mjs), 皆於無error監聽者下觸發
//mkSite, 站點描述: id、label(固定標籤)、errType(安全摘要之errType)、opt(建構設定)、run(觸發情境)、marker(細節須含之字串, 預設為哨兵)
let mkSite = (id, label, errType, opt, run, marker = '') => {
    return {
        id,
        label,
        errType,
        opt,
        run,
        marker,
    }
}

let clientSites = [
    mkSite('C1', 'invalid tableTags for setTableTags', 'string', {}, (c) => {
        c.setTableTags(`str-${SENT}`)
    }),
    mkSite('C2', 'invalid tableTags', 'string', {}, async (c) => {
        await c.updateTableTags(`str-${SENT}`)
    }),
    mkSite('C3', 'can not get table data', 'Error', {}, async (c) => { //後端或使用端之拒絕值(如getUserIdByToken)含權杖
        c.on('refreshTable', (input) => {
            input.pm.reject(Object.assign(new Error(`getUserIdByToken rejected token=${SENT}`), { code: `code-${SENT}` })) //非允許集合之code不入安全摘要
        })
        await c.updateTableTags({ [`tab-${SENT}`]: `tag-${SENT}` })
    }),
    mkSite('C4', 'can not save table data', 'TypeError', {}, async (c) => { //setTableTags傳入凍結物件而無法寫入, 其訊息含表名
        c.setTableTags(Object.freeze({}))
        c.on('refreshTable', (input) => {
            input.pm.resolve('d')
        })
        await c.updateTableTags({ [`tab-${SENT}`]: 'tag-1' })
    }),
    mkSite('C5', 'updateTableTags catch', 'Error', {}, async (c) => { //入口快照時取值之getter拋錯
        await c.updateTableTags({
            get A() {
                throw new Error(`getter failed for ${SENT}`)
            },
        })
    }),
    mkSite('C6', 'can not get tags data', 'Error', { pollingDelayTime: 1 }, async (c) => {
        c.on('refreshTags', (input) => {
            input.pm.reject(new Error(`getToken threw ${SENT}`))
        })
        await c.pollingTableTags()
    }),
    mkSite('C7', 'can not get table data', 'Error', { refreshTimeout: 1 }, async (c) => { //等待上限逾時, 表名與時間戳入事件
        c.on('refreshTable', () => {}) //不回覆
        await c.updateTableTags({ [`tab-${SENT}`]: `tag-${SENT}` })
    }),
]

//serverSites, 伺服端各error站點(盤點: git grep -n --untracked "eeEmit\(Now\)\?('error'" -- src/WSyncWebdataServer.mjs); fpTableTags由各站點決定
let fpSecretDir = `${fdTmp}/user-${SENT}` //為資料夾, 讀寫皆失敗, 其錯誤訊息含此路徑
let serverSites = [
    mkSite('S1', 'readTableTags catch', 'Error', { fpTableTags: fpSecretDir }, (s) => { //細節含錯誤訊息(路徑由wsemi之getDiag於細節內另行遮罩, 不屬本套件之斷言)
        s.readTableTags()
    }, 'EISDIR'),
    mkSite('S2', 'writeTableTags catch', 'Error', { fpTableTags: fpSecretDir }, (s) => {
        s.writeTableTags()
    }, 'EISDIR'),
    mkSite('S3', 'writeTableTags catch', 'Error', { fpTableTags: `${fdTmp}/s3.json` }, (s) => { //時間戳不可序列化
        s.initTableTags({
            A: {
                toJSON: () => {
                    throw new Error(`serialize failed for ${SENT}`)
                },
            },
        }, 'useInputOnly')
    }),
    mkSite('S4', 'invalid tableTags for initTableTags', 'string', { fpTableTags: `${fdTmp}/s4.json` }, (s) => {
        s.initTableTags(`str-${SENT}`)
    }),
    mkSite('S5', 'invalid tableTags for setTableTags', 'object', { fpTableTags: `${fdTmp}/s5.json` }, (s) => {
        s.setTableTags(['x', SENT])
    }),
    mkSite('S6', 'invalid tableName', 'object', { fpTableTags: `${fdTmp}/s6.json` }, (s) => {
        s.updateTableTag({ k: SENT })
    }),
    mkSite('S7', 'writeTableTags catch', 'Error', { fpTableTags: `${fdTmp}/nodir-${SENT}/s7.json` }, (s) => { //clearSync落檔失敗, 以emitNow於呼叫當下同步通報
        s.updateTableTag('A')
        s.clearSync()
    }, 'ENOENT'),
]


describe('diag(本套件自發之error於無error監聽者時之console輸出)', function() {

    let n0 = 0
    before(async function() {
        n0 = await baselineTimers()
        fs.rmSync(fdTmp, { recursive: true, force: true })
        fs.mkdirSync(fpSecretDir, { recursive: true })
    })
    after(async function() {
        fs.rmSync(fdTmp, { recursive: true, force: true })
        await settleTimers(n0, 'diag')
    })

    //R01 預設只出固定標籤與安全摘要
    for (let site of clientSites) {
        it(`G-${site.id} 前端[${site.label}]無error監聽者時預設只出固定標籤與安全摘要, 不含哨兵`, async function() {
            let { calls } = await runWith(WSyncWebdataClient, () => w.evem(), site.opt || {}, site.run, site.id)
            assertDefault(calls, site)
        })
    }
    for (let site of serverSites) {
        it(`G-${site.id} 伺服端[${site.label}]無error監聽者時預設只出固定標籤與安全摘要, 不含哨兵`, async function() {
            let { calls } = await runWith(WSyncWebdataServer, () => w.evem(), site.opt, site.run, site.id)
            assertDefault(calls, site)
        })
    }

    //R02 opt.logDetail===true還原遮罩後之細節
    for (let site of clientSites) {
        it(`D-${site.id} 前端[${site.label}]opt.logDetail為true時輸出細節(含msg與哨兵)`, async function() {
            let { calls } = await runWith(WSyncWebdataClient, () => w.evem(), { ...site.opt, logDetail: true }, site.run, site.id)
            assertDetail(calls, site)
        })
    }
    for (let site of serverSites) {
        it(`D-${site.id} 伺服端[${site.label}]opt.logDetail為true時輸出細節(含msg與哨兵)`, async function() {
            let { calls } = await runWith(WSyncWebdataServer, () => w.evem(), { ...site.opt, logDetail: true }, site.run, site.id)
            assertDetail(calls, site)
        })
    }

    //R03 opt.funLog取代console
    for (let site of clientSites) {
        it(`F-${site.id} 前端[${site.label}]opt.funLog取代console, 收到(固定標籤, 安全摘要, 細節)`, async function() {
            let { calls, fl } = await runWith(WSyncWebdataClient, () => w.evem(), { ...site.opt, funLog: true }, site.run, site.id)
            assertFunLog(calls, fl, site)
        })
    }
    for (let site of serverSites) {
        it(`F-${site.id} 伺服端[${site.label}]opt.funLog取代console, 收到(固定標籤, 安全摘要, 細節)`, async function() {
            let { calls, fl } = await runWith(WSyncWebdataServer, () => w.evem(), { ...site.opt, funLog: true }, site.run, site.id)
            assertFunLog(calls, fl, site)
        })
    }

    it('X1 opt.logDetail非布林true者(字串、數字)不啟用細節, 仍只出安全摘要', async function() {
        let site = clientSites[2]
        for (let v of ['true', 1, {}]) {
            let { calls } = await runWith(WSyncWebdataClient, () => w.evem(), { logDetail: v }, site.run, site.id)
            assertDefault(calls, site)
        }
    })

    it('X2 opt.funLog拋錯不影響流程(afterUpdateTableTags仍發出), 且不寫console', async function() {
        let st = stubConsole()
        let n = 0
        let after = 0
        let c = null
        try {
            c = new WSyncWebdataClient(w.evem(), {
                funLog: () => {
                    n++
                    throw new Error(`funLog boom ${SENT}`)
                },
            })
            c.on('refreshTable', (input) => {
                input.pm.reject(new Error(SENT))
            })
            c.on('afterUpdateTableTags', () => {
                after++
            })
            await within(c.updateTableTags({ A: 'a1' }), 'X2')
            await fence()
        }
        finally {
            c.clearSync()
            st.restore()
        }
        assert.strict.equal(n, 1)
        assert.strict.equal(after, 1)
        assert.strict.equal(st.calls.length, 0, dump(st.calls))
    })

    //R04 有error監聽者時事件載荷完整(含err、tableName、timeTag), 不寫console
    it('E1 前端有error監聽者時事件載荷不變(含err、tableName、timeTag)且不寫console', async function() {
        let st = stubConsole()
        let got = []
        let c = null
        try {
            c = new WSyncWebdataClient(w.evem(), {})
            c.on('error', (msg) => {
                got.push(msg)
            })
            let boom = new Error(`token=${SENT}`)
            c.on('refreshTable', (input) => {
                input.pm.reject(boom)
            })
            await within(c.updateTableTags({ [`tab-${SENT}`]: `tag-${SENT}` }), 'E1')
            await fence()
            assert.strict.equal(got.length, 1)
            assert.strict.equal(got[0].msg, `can not get table data: tab-${SENT}`)
            assert.strict.equal(got[0].err, boom)
            assert.strict.equal(got[0].tableName, `tab-${SENT}`)
            assert.strict.equal(got[0].timeTag, `tag-${SENT}`)
        }
        finally {
            c.clearSync()
            st.restore()
        }
        assert.strict.equal(st.calls.length, 0, dump(st.calls))
    })

    it('E2 伺服端有error監聽者時事件載荷不變(含err)且不寫console', async function() {
        let st = stubConsole()
        let got = []
        let s = null
        try {
            s = new WSyncWebdataServer(w.evem(), { fpTableTags: fpSecretDir })
            s.on('error', (msg) => {
                got.push(msg)
            })
            s.writeTableTags()
            await within(fence(), 'E2')
            assert.strict.equal(got.length, 1)
            assert.strict.equal(got[0].msg, 'writeTableTags catch')
            assert.ok(got[0].err instanceof Error && got[0].err.message.includes(SENT)) //事件之使用端自行監聽, 載荷完整
        }
        finally {
            s.clearSync()
            st.restore()
        }
        assert.strict.equal(st.calls.length, 0, dump(st.calls))
    })

    //R05 建構期固定詞彙之提示亦走同一出口
    it('K1 前端傳入無效事件物件時之提示: 預設console.log固定詞彙; opt.funLog可接', async function() {
        let label = 'instWConverClient is not an effective object, and set instWConverClient to an EventEmitter'
        let st = stubConsole()
        let c1 = null
        try {
            c1 = new WSyncWebdataClient(null, {})
        }
        finally {
            c1.clearSync()
            st.restore()
        }
        assert.strict.deepEqual(st.calls, [{ m: 'log', args: [label] }])
        let fl = []
        let st2 = stubConsole()
        let c2 = null
        try {
            c2 = new WSyncWebdataClient(null, { funLog: (...args) => fl.push(args) })
        }
        finally {
            c2.clearSync()
            st2.restore()
        }
        assert.strict.equal(st2.calls.length, 0)
        assert.strict.equal(fl.length, 1)
        assert.strict.equal(fl[0][0], label)
    })

    it('K2 伺服端傳入無效事件物件時之提示: 預設console.log固定詞彙; opt.funLog可接', async function() {
        let label = 'instWConverServer is not an effective object, and set instWConverServer to an EventEmitter'
        let fp = `${fdTmp}/k2.json`
        let st = stubConsole()
        let s1 = null
        try {
            s1 = new WSyncWebdataServer(null, { fpTableTags: fp })
        }
        finally {
            s1.clearSync()
            st.restore()
        }
        assert.strict.deepEqual(st.calls, [{ m: 'log', args: [label] }])
        let fl = []
        let st2 = stubConsole()
        let s2 = null
        try {
            s2 = new WSyncWebdataServer(null, { fpTableTags: fp, funLog: (...args) => fl.push(args) })
        }
        finally {
            s2.clearSync()
            st2.restore()
        }
        assert.strict.equal(st2.calls.length, 0)
        assert.strict.equal(fl.length, 1)
        assert.strict.equal(fl[0][0], label)
    })

    //R06 src內除註解外不直接呼叫console, 診斷輸出一律經wsemi之getDiag
    it('R1 src內除註解外不直接呼叫console(診斷輸出一律經getDiag)', function() {
        let fns = fs.readdirSync('./src').filter((v) => v.endsWith('.mjs'))
        assert.ok(fns.length >= 3)
        let hits = []
        for (let fn of fns) {
            let c = fs.readFileSync(`./src/${fn}`, 'utf8')
            c = c.replace(/\/\*[\s\S]*?\*\//g, '') //區塊註解(含JSDoc之範例)
            c = c.split('\n').map((v) => v.replace(/(^|\s)\/\/.*/, '')).join('\n') //行註解(檔案可能為CRLF, 不以$錨定行尾)
            if (/\bconsole\s*[.[]/.test(c)) {
                hits.push(fn)
            }
        }
        assert.strict.deepEqual(hits, [])
    })

})
