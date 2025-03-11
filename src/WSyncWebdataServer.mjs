import fs from 'fs'
import get from 'lodash-es/get.js'
import debounce from 'lodash-es/debounce.js'
import merge from 'lodash-es/merge.js'
import now2str from 'wsemi/src/now2str.mjs'
import genID from 'wsemi/src/genID.mjs'
import evem from 'wsemi/src/evem.mjs'
import isestr from 'wsemi/src/isestr.mjs'
import iseobj from 'wsemi/src/iseobj.mjs'
import j2o from 'wsemi/src/j2o.mjs'
import o2j from 'wsemi/src/o2j.mjs'


/**
 * 伺服器端之資料同步器
 *
 * @class
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {String} [opt.fpTableTags='tableTags.json'] 輸入儲存各資料表時間戳檔案路徑串，預設'./tableTags.json'
 * @returns {Object} 回傳後端資料同步物件，可監聽事件changeTableTags、error，可使用函數readTableTags、writeTableTags、initTableTags、setTableTags、getTableTags、updateTableTag
 * @example
 *
 * import WSyncWebdataServer from './src/WSyncWebdataServer.mjs'
 * import WSyncWebdataClient from './src/WSyncWebdataClient.mjs'
 *
 * //log time
 * let i = 0
 * console.log('i=', i)
 * let ts = setInterval(() => {
 *     i += 1
 *     console.log('i=', i)
 *     if (i >= 7) {
 *         clearInterval(ts)
 *     }
 * }, 1000)
 *
 * //-------- back-end ---------
 *
 * //wsds
 * let wsds = new WSyncWebdataServer()
 *
 * //tableTagsSrv
 * let tableTagsSrv = {
 *     tabA: '2020-01-01T00:00:00+08:00',
 *     tabB: '2020-01-01T01:00:00+08:00',
 * }
 *
 * //initTableTags
 * wsds.initTableTags(tableTagsSrv)
 *
 * //readTableTags
 * console.log('server: nowTableTags', wsds.readTableTags())
 *
 * //updateTableTag
 * setTimeout(() => {
 *     wsds.updateTableTag('tabA')
 * }, 2400)
 * setTimeout(() => {
 *     wsds.updateTableTag('tabB')
 * }, 3600)
 * setTimeout(() => {
 *     wsds.updateTableTag('tabA')
 * }, 4800)
 *
 * //changeTableTags
 * wsds.on('changeTableTags', (nowTableTags) => {
 *     console.log('server: changeTableTags', nowTableTags)
 *     //This example does not push to front-end, wait polling form the front-end.
 * })
 *
 * //error
 * wsds.on('error', (err) => {
 *     console.log('server: error', err)
 * })
 *
 * //getAPITableTags, Simulated back-end API for sending table timestamp.
 * async function getAPITableTags() {
 *     return new Promise((resolve, reject) => {
 *         setTimeout(() => {
 *             resolve(wsds.getTableTags())
 *         }, 100)
 *     })
 * }
 *
 * //getAPIData, Simulated back-end API for sending table data.
 * let tabsCount = {
 *     tabA: 0,
 *     tabB: 0,
 * }
 * async function getAPIData(tableName) {
 *     return new Promise((resolve, reject) => {
 *         setTimeout(() => {
 *             tabsCount[tableName] += 1
 *             resolve(`table[${tableName}] = ${tabsCount[tableName]}`)
 *         }, 100)
 *     })
 * }
 *
 * //-------- front-end ---------
 *
 * //optc
 * let optc = {
 *     usePollingTableTags: true,
 * }
 *
 * //wsdc
 * let wsdc = new WSyncWebdataClient(optc)
 *
 * //tableTagsCl
 * let tableTagsCl = {
 *     tabA: '2020-01-01T00:00:00+08:00',
 *     tabB: '2020-01-01T01:00:00+08:00',
 * }
 *
 * //setTableTags, Loaded tableTags directly if cache (cookie or localStorage) is available in front-end.
 * wsdc.setTableTags(tableTagsCl)
 *
 * //Simulate mouseover event of front-end in node.js, and call pollingTableTags for triggering.
 * let n = 0
 * let t = setInterval(() => {
 *     n += 1
 *     wsdc.pollingTableTags()
 *     if (n >= 65) {
 *         clearInterval(t)
 *     }
 * }, 100)
 *
 * //refreshTags
 * wsdc.on('refreshTags', ({ pm }) => {
 *     //console.log('client: refreshTags')
 *
 *     //getAPITableTags
 *     console.log('client: getAPITableTags before')
 *     getAPITableTags()
 *         .then((nowTableTags) => {
 *             console.log('client: getAPITableTags after: ', nowTableTags)
 *             pm.resolve(nowTableTags)
 *         })
 *         .catch((err) => {
 *             pm.reject(err)
 *         })
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
 *     //console.log('client: refreshTable', input)
 *
 *     //Call API when receiving an updating tableTags of event.
 *     console.log('client: getAPIData before: ' + input.tableName)
 *     getAPIData(input.tableName)
 *         .then((data) => {
 *             console.log('client: getAPIData after: ' + data)
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
 *     //Update data, save or transfer it to vuex etc.
 * })
 *
 * //beforeUpdateTableTags, afterUpdateTableTags, beforePollingTableTags, afterPollingTableTags
 * wsdc.on('beforeUpdateTableTags', (msg) => {
 *     console.log('client: beforeUpdateTableTags', msg)
 * })
 * wsdc.on('afterUpdateTableTags', (msg) => {
 *     console.log('client: afterUpdateTableTags', msg)
 * })
 * wsdc.on('beforePollingTableTags', () => {
 *     console.log('client: beforePollingTableTags')
 * })
 * wsdc.on('afterPollingTableTags', () => {
 *     console.log('client: afterPollingTableTags')
 * })
 *
 * //error
 * wsdc.on('error', (err) => {
 *     console.log('client: error', err)
 * })
 *
 */
function WSyncWebdataServer(opt = {}) {
    let nowTableTags = {}

    //fpTableTags
    let fpTableTags = get(opt, 'fpTableTags', '')
    if (!isestr(fpTableTags)) {
        fpTableTags = './tableTags.json'
    }

    //ee
    let ee = evem()

    //eeEmit
    function eeEmit(name, ...args) {
        setTimeout(() => {
            ee.emit(name, ...args)
        }, 1)
    }

    /**
     * 讀取各資料表時間資料
     *
     * @memberof WSyncWebdataServer
     * @returns {Object} 回傳各資料表時間戳物件
     * @example
     * let tableTags = wsds.readTableTags()
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
     * let tableTags = {...}
     * wsds.writeTableTags(tableTags)
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
     * let tableTags = {...}
     * let mode = ''
     * wsds.initTableTags(tableTags, mode)
     */
    function initTableTags(tableTags = {}, mode = 'useInputFirst') {
        // mode可有:
        // useInputFirst
        // useStorageFirst
        // useInputOnly
        // useStorageOnly

        //mode
        if (mode === 'useStorageFirst') {
            nowTableTags = merge(tableTags, readTableTags())
        }
        else if (mode === 'useInputOnly') {
            nowTableTags = tableTags
        }
        else if (mode === 'useStorageOnly') {
            nowTableTags = readTableTags()
        }
        else {
            //mode === 'useInputFirst'
            nowTableTags = merge(readTableTags(), tableTags)
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
     * let tableTags = {...}
     * wsds.setTableTags(tableTags)
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
     * let tableTags = wsds.getTableTags()
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
     * let tableName = '...'
     * wsds.updateTableTag(tableName)
     */
    function updateTableTag(tableName) {

        //modify
        nowTableTags[tableName] = now2str() + '|' + genID(6)

        //updateTableTagCore
        updateTableTagCore()

    }

    /**
     * 監聽更新資料表事件，當外部監聽收到更新通知時再推播nowTableTags至前端
     *
     * @memberof WSyncWebdataServer
     * @param {Object} nowTableTags 各資料表時間戳物件
     * @example
     * wo.on('changeTableTags', function(nowTableTags) {
     *     ...
     * })
     */
    function onChangeUpdateTableTag() {} onChangeUpdateTableTag()

    //save
    ee.readTableTags = readTableTags
    ee.writeTableTags = writeTableTags
    ee.initTableTags = initTableTags
    ee.setTableTags = setTableTags
    ee.getTableTags = getTableTags
    ee.updateTableTag = updateTableTag

    return ee
}


export default WSyncWebdataServer
