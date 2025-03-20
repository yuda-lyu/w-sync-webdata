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
import j2o from 'wsemi/src/j2o.mjs'
import o2j from 'wsemi/src/o2j.mjs'


/**
 * 伺服器端之資料同步器
 *
 * @class
 * @param {Object} instWConverServer 輸入通訊服務實體物件，可使用例如WConverhpServer等建立
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {String} [opt.fpTableTags='tableTags.json'] 輸入儲存各資料表時間戳檔案路徑串，預設'./tableTags.json'
 * @returns {Object} 回傳後端資料同步物件，可監聽事件changeTableTags、error，可使用函數readTableTags、writeTableTags、initTableTags、setTableTags、getTableTags、updateTableTag
 * @example
 *
 * import w from 'wsemi'
 * import WSyncWebdataServer from './src/WSyncWebdataServer.mjs'
 * import WSyncWebdataClient from './src/WSyncWebdataClient.mjs'
 *
 * //-------- back-end ---------
 *
 * //EventEmitter, Simulated back-end push notification to front-end.
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
 *     },
 * )
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
 * }, 500)
 * setTimeout(() => {
 *     wsds.updateTableTag('tabB')
 * }, 750)
 * setTimeout(() => {
 *     wsds.updateTableTag('tabA')
 * }, 1000)
 *
 * //changeTableTags
 * wsds.on('changeTableTags', (nowTableTags) => {
 *     console.log('server: changeTableTags', nowTableTags)
 *
 *     //server push
 *     console.log('server: push')
 *     ee.emit('push', nowTableTags)
 *
 * })
 *
 * //error
 * wsds.on('error', (err) => {
 *     console.log('server: error', err)
 * })
 *
 * //getAPIData, Simulated back-end API for data transfer
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
