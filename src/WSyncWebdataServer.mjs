import fs from 'fs'
import get from 'lodash-es/get.js'
import debounce from 'lodash-es/debounce.js'
import merge from 'lodash-es/merge.js'
import now2str from 'wsemi/src/now2str.mjs'
import genID from 'wsemi/src/genID.mjs'
import evem from 'wsemi/src/evem.mjs'
import haskey from 'wsemi/src/haskey.mjs'
import isestr from 'wsemi/src/isestr.mjs'
import iseobj from 'wsemi/src/iseobj.mjs'
import isfun from 'wsemi/src/isfun.mjs'
import j2o from 'wsemi/src/j2o.mjs'
import o2j from 'wsemi/src/o2j.mjs'


/**
 * 伺服器端之資料同步器
 *
 * @class
 * @param {Object} instWConverServer 輸入通訊服務實體物件，可使用例如WConverhpServer等建立
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {String} [opt.fpTableTags='tableTags.json'] 輸入儲存各資料表時間戳檔案路徑串，預設'./tableTags.json'
 * @param {Function} [opt.genTag=()=>'{random string}'] 輸入產生不重複識別碼函數，預設()=>'{random string}'
 * @returns {Object} 回傳後端資料同步物件，可監聽事件changeTableTags、error，可使用函數readTableTags、writeTableTags、initTableTags、setTableTags、getTableTags、updateTableTag
 * @example
 *
 * //前後端共用範例
 * import w from 'wsemi'
 * import WSyncWebdataServer from './src/WSyncWebdataServer.mjs'
 * import WSyncWebdataClient from './src/WSyncWebdataClient.mjs'
 *
 * let ms = []
 *
 * let ntg = 0
 * let genTag = () => {
 *     ntg++
 *     return `tag-${ntg}`
 * }
 *
 * //-------- 後端 ---------
 *
 * //EventEmitter, 模擬後端推播至前端
 * let ee = w.evem()
 *
 * //instWConverServer
 * let instWConverServer = w.evem()
 *
 * //wsds
 * let wsds = new WSyncWebdataServer(
 *     instWConverServer,
 *     {
 *         // fpTableTags: 'tableTags-sync-webdata.json',
 *         genTag,
 *     },
 * )
 *
 * //tableTagsSrv
 * let tableTagsSrv = {
 *     tabA: 'tag-0-a',
 *     tabB: 'tag-0-b',
 * }
 *
 * //initTableTags
 * wsds.initTableTags(tableTagsSrv)
 *
 * //readTableTags
 * console.log('server: nowTableTags', wsds.readTableTags())
 * ms.push({ 'server nowTableTags': JSON.stringify(wsds.readTableTags()) })
 *
 * //updateTableTag
 * setTimeout(() => {
 *     wsds.updateTableTag('tabA')
 *     ms.push({ 'server updateTableTag': 'tabA' })
 * }, 500)
 * setTimeout(() => {
 *     wsds.updateTableTag('tabB')
 *     ms.push({ 'server updateTableTag': 'tabB' })
 * }, 750)
 * setTimeout(() => {
 *     wsds.updateTableTag('tabA')
 *     ms.push({ 'server updateTableTag': 'tabA' })
 * }, 1000)
 *
 * //changeTableTags
 * wsds.on('changeTableTags', (nowTableTags) => {
 *     console.log('server: changeTableTags', nowTableTags)
 *
 *     //server push
 *     console.log('server: push')
 *     ms.push({ 'server changeTableTags': JSON.stringify(nowTableTags) })
 *     ee.emit('push', nowTableTags)
 *
 * })
 *
 * //error
 * wsds.on('error', (err) => {
 *     console.log('server: error', err)
 * })
 *
 * //getAPIData, 模擬後端提供API
 * let tabsCount = {
 *     tabA: 0,
 *     tabB: 0,
 * }
 * async function getAPIData(tableName) {
 *     ms.push({ 'server call getAPIData before': tableName })
 *     return new Promise((resolve, reject) => {
 *         setTimeout(() => {
 *             tabsCount[tableName] += 1
 *             ms.push({ 'server call getAPIData after': `table[${tableName}] = ${tabsCount[tableName]}` })
 *             resolve(`table[${tableName}] = ${tabsCount[tableName]}`)
 *         }, 100)
 *     })
 * }
 *
 * //-------- 前端 ---------
 *
 * //instWConverClient
 * let instWConverClient = w.evem()
 *
 * //wsdc
 * let wsdc = new WSyncWebdataClient(instWConverClient, {})
 *
 * //tableTagsCl
 * let tableTagsCl = {
 *     tabA: 'tag-0-a',
 *     tabB: 'tag-0-b',
 * }
 *
 * //setTableTags, 模擬前端將tableTags預先或有變更即儲存至localStorage, 啟動時有既有tableTags
 * wsdc.setTableTags(tableTagsCl)
 * ms.push({ 'clinet setTableTags': JSON.stringify(tableTagsCl) })
 *
 * //push, 模擬前端接收後端推播有變更tableTags
 * ee.on('push', (nowTableTags) => {
 *
 *     //updateTableTags
 *     wsdc.updateTableTags(nowTableTags)
 *     ms.push({ 'clinet updateTableTags': JSON.stringify(nowTableTags) })
 *
 * })
 *
 * //refreshState
 * wsdc.on('refreshState', (msg) => {
 *     console.log('client: refreshState needToRefresh', msg.needToRefresh)
 * })
 *
 * //refreshTable
 * wsdc.on('refreshTable', (input) => {
 *     // console.log('client: refreshTable', input)
 *
 *     //收到有變更tableTags, 模擬呼叫後端API
 *     console.log('client: getAPIData before: ' + input.tableName)
 *     ms.push({ 'clinet call getAPIData before': input.tableName })
 *     getAPIData(input.tableName)
 *         .then((data) => {
 *             console.log('client: getAPIData after: ' + data)
 *             ms.push({ 'clinet call getAPIData after': data })
 *             input.pm.resolve(data) //Use pm.resolve to retrieve the data, and pm.reject the message when get an error.
 *         })
 *         .catch((err) => {
 *             input.pm.reject(err)
 *         })
 *
 * })
 *
 * //getData
 * wsdc.on('getData', (data) => {
 *     console.log('client: getData', data)
 *     //前端取得數據
 * })
 *
 * //beforeUpdateTableTags, afterUpdateTableTags
 * wsdc.on('beforeUpdateTableTags', (msg) => {
 *     // console.log('client: beforeUpdateTableTags', msg)
 * })
 * wsdc.on('afterUpdateTableTags', (msg) => {
 *     // console.log('client: afterUpdateTableTags', msg)
 * })
 *
 * //error
 * wsdc.on('error', (err) => {
 *     console.log('client: error', err)
 * })
 *
 * setTimeout(() => {
 *     console.log('ms', ms)
 * }, 2000)
 *
 * // server: nowTableTags { tabA: 'tag-0-a', tabB: 'tag-0-b' }
 * // server: changeTableTags { tabA: 'tag-1', tabB: 'tag-0-b' }
 * // server: push
 * // client: refreshState needToRefresh true
 * // client: getAPIData before: tabA
 * // client: getAPIData after: table[tabA] = 1
 * // client: getData { tableName: 'tabA', timeTag: 'tag-1', data: 'table[tabA] = 1' }
 * // server: changeTableTags { tabA: 'tag-1', tabB: 'tag-2' }
 * // server: push
 * // client: refreshState needToRefresh true
 * // client: getAPIData before: tabB
 * // client: getAPIData after: table[tabB] = 1
 * // client: getData { tableName: 'tabB', timeTag: 'tag-2', data: 'table[tabB] = 1' }
 * // server: changeTableTags { tabA: 'tag-3', tabB: 'tag-2' }
 * // server: push
 * // client: refreshState needToRefresh true
 * // client: getAPIData before: tabA
 * // client: getAPIData after: table[tabA] = 2
 * // client: getData { tableName: 'tabA', timeTag: 'tag-3', data: 'table[tabA] = 2' }
 * // ms [
 * //   { 'server nowTableTags': '{"tabA":"tag-0-a","tabB":"tag-0-b"}' },
 * //   { 'clinet setTableTags': '{"tabA":"tag-0-a","tabB":"tag-0-b"}' },
 * //   { 'server updateTableTag': 'tabA' },
 * //   { 'server changeTableTags': '{"tabA":"tag-1","tabB":"tag-0-b"}' },
 * //   { 'clinet updateTableTags': '{"tabA":"tag-1","tabB":"tag-0-b"}' },
 * //   { 'clinet call getAPIData before': 'tabA' },
 * //   { 'server call getAPIData before': 'tabA' },
 * //   { 'server updateTableTag': 'tabB' },
 * //   { 'server call getAPIData after': 'table[tabA] = 1' },
 * //   { 'clinet call getAPIData after': 'table[tabA] = 1' },
 * //   { 'server changeTableTags': '{"tabA":"tag-1","tabB":"tag-2"}' },
 * //   { 'clinet updateTableTags': '{"tabA":"tag-1","tabB":"tag-2"}' },
 * //   { 'clinet call getAPIData before': 'tabB' },
 * //   { 'server call getAPIData before': 'tabB' },
 * //   { 'server updateTableTag': 'tabA' },
 * //   { 'server call getAPIData after': 'table[tabB] = 1' },
 * //   { 'clinet call getAPIData after': 'table[tabB] = 1' },
 * //   { 'server changeTableTags': '{"tabA":"tag-3","tabB":"tag-2"}' },
 * //   { 'clinet updateTableTags': '{"tabA":"tag-3","tabB":"tag-2"}' },
 * //   { 'clinet call getAPIData before': 'tabA' },
 * //   { 'server call getAPIData before': 'tabA' },
 * //   { 'server call getAPIData after': 'table[tabA] = 2' },
 * //   { 'clinet call getAPIData after': 'table[tabA] = 2' }
 * // ]
 *
 */
function WSyncWebdataServer(instWConverServer, opt = {}) {
    let nowTableTags = {}

    //check
    if (!iseobj(instWConverServer)) {
        console.log('instWConverServer is not an effective object, and set instWConverServer to an EventEmitter')
        instWConverServer = evem()
    }
    if (!haskey(instWConverServer, 'emit')) {
        throw new Error(`instWConverServer is not an EventEmitter`)
    }

    //fpTableTags
    let fpTableTags = get(opt, 'fpTableTags', '')
    if (!isestr(fpTableTags)) {
        fpTableTags = './tableTags.json'
    }

    //genTag
    let genTag = get(opt, 'genTag')
    if (!isfun(genTag)) {
        genTag = () => {
            return now2str() + '|' + genID(6)
        }
    }

    //eeEmit
    let eeEmit = (name, ...args) => {
        setTimeout(() => {
            instWConverServer.emit(name, ...args)
        }, 1)
    }

    /**
     * 讀取各資料表時間資料
     *
     * @memberof WSyncWebdataServer
     * @returns {Object} 回傳各資料表時間戳物件
     * @example
     *
     * let tableTags = wsds.readTableTags()
     *
     */
    function readTableTags() {
        let r = {}
        try {
            if (fs.existsSync(fpTableTags)) {
                let c = fs.readFileSync(fpTableTags, 'utf8')
                let o = j2o(c)
                if (iseobj(o)) {
                    r = o
                }
            }
        }
        catch (err) {
            eeEmit('error', {
                msg: 'readTableTags catch',
                err,
            })
        }
        return r
    }

    /**
     * 儲存各資料表時間資料
     *
     * @memberof WSyncWebdataServer
     * @param {Object} tableTags 輸入各資料表時間戳物件
     * @returns {Undefined} 無回傳
     * @example
     *
     * let tableTags = {...}
     * wsds.writeTableTags(tableTags)
     *
     */
    function writeTableTags() {
        try {
            let c = o2j(nowTableTags)
            fs.writeFileSync(fpTableTags, c, 'utf8')
        }
        catch (err) {
            eeEmit('error', {
                msg: 'writeTableTags catch',
                err,
            })
        }
    }

    /**
     * 初始化各資料表時間資料
     *
     * @memberof WSyncWebdataServer
     * @param {Object} tableTags 輸入各資料表時間戳物件
     * @param {String} [mode='useInputFirst'] 輸入使用設定方式字串，可有'useInputFirst'代表使用傳入設定優先再與既有JSON檔設定合併，為預設值，'useStorageFirst'代表使用既有JSON檔設定優先再與傳入設定合併，'useInputOnly'代表只使用傳入設定，'useStorageOnly'代表只使用既有JSON檔設定
     * @returns {Undefined} 無回傳
     * @example
     *
     * let tableTags = {...}
     * let mode = ''
     * wsds.initTableTags(tableTags, mode)
     *
     */
    function initTableTags(tableTags = {}, mode = 'useInputFirst') {
        // mode可有:
        // useInputFirst
        // useStorageFirst
        // useInputOnly
        // useStorageOnly

        //mode
        if (mode === 'useInputOnly') {
            nowTableTags = tableTags
        }
        else if (mode === 'useStorageOnly') {
            nowTableTags = readTableTags()
        }
        else if (mode === 'useInputFirst') {
            nowTableTags = merge(readTableTags(), tableTags)
        }
        else if (mode === 'useStorageFirst') {
            nowTableTags = merge(tableTags, readTableTags())
        }
        else {
            throw new Error(`invalid mode[${mode}]`)
        }

        //writeTableTags
        writeTableTags()

    }

    /**
     * 直接設定各資料表時間資料
     *
     * @memberof WSyncWebdataServer
     * @param {Object} tableTags 輸入各資料表時間戳物件
     * @returns {Undefined} 無回傳
     * @example
     *
     * let tableTags = {...}
     * wsds.setTableTags(tableTags)
     *
     */
    function setTableTags(tableTags = {}) {

        //merge
        nowTableTags = merge(nowTableTags, tableTags)

        //writeTableTags
        writeTableTags()

    }

    /**
     * 直接取得各資料表時間資料
     *
     * @memberof WSyncWebdataServer
     * @returns {Object} 回傳各資料表時間戳物件
     * @example
     *
     * let tableTags = wsds.getTableTags()
     *
     */
    function getTableTags() {
        return nowTableTags
    }

    //updateTableTagCore, 避免大量更新時造成大量推播, 通過debounce合併故是回傳nowTableTags
    let updateTableTagCore = debounce(() => {

        //writeTableTags
        writeTableTags()

        //emit
        eeEmit('changeTableTags', nowTableTags)

    }, 200)

    /**
     * 更新指定資料表之時間戳，當資料表更新時需調用此函數
     *
     * @memberof WSyncWebdataServer
     * @param {String} tableTag 輸入欲更新指定資料表名稱字串
     * @returns {Undefined} 無回傳
     * @example
     *
     * let tableName = '...'
     * wsds.updateTableTag(tableName)
     *
     */
    function updateTableTag(tableName) {

        //modify
        nowTableTags[tableName] = genTag()

        //updateTableTagCore
        updateTableTagCore()

    }

    /**
     * 監聽更新資料表事件，當外部監聽收到更新通知時再推播nowTableTags至前端
     *
     * @memberof WSyncWebdataServer
     * @param {Object} nowTableTags 各資料表時間戳物件
     * @example
     *
     * wo.on('changeTableTags', function(nowTableTags) {
     *     ...
     * })
     *
     */
    function onChangeUpdateTableTag() {} onChangeUpdateTableTag()

    //save
    instWConverServer.readTableTags = readTableTags
    instWConverServer.writeTableTags = writeTableTags
    instWConverServer.initTableTags = initTableTags
    instWConverServer.setTableTags = setTableTags
    instWConverServer.getTableTags = getTableTags
    instWConverServer.updateTableTag = updateTableTag

    return instWConverServer
}


export default WSyncWebdataServer
