import path from 'path'
import fs from 'fs'
import events from 'events'
import debounce from 'lodash/debounce'
import merge from 'lodash/merge'
import now2str from 'wsemi/src/now2str.mjs'
import genID from 'wsemi/src/genID.mjs'
import iseobj from 'wsemi/src/iseobj.mjs'
import j2o from 'wsemi/src/j2o.mjs'
import o2j from 'wsemi/src/o2j.mjs'


let fdSrv = path.resolve()


/**
 * 伺服器端之資料同步器
 *
 * @class
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {Integer} [opt.fnTableTags='tableTags.json'] 輸入各資料表時間戳儲存檔案名稱字串，預設'tableTags.json'
 * @returns {Object} 回傳後端資料同步物件，可監聽事件changeTableTags、error，可使用函數readTableTags、writeTableTags、initTableTags、setTableTags、getTableTags、updateTableTag
 * @example
 */
function WSyncWebdataServer(opt = {}) {
    let nowTableTags = {}


    //default
    if (!opt.fnTableTags) {
        opt.fnTableTags = 'tableTags.json'
    }


    //fnTableTags
    let fnTableTags = `${fdSrv}/${opt.fnTableTags}`


    //ee
    let ee = new events.EventEmitter()


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
            if (fs.existsSync(fnTableTags)) {
                let c = fs.readFileSync(fnTableTags, 'utf8')
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
            fs.writeFileSync(fnTableTags, c, 'utf8')
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


    ee.readTableTags = readTableTags
    ee.writeTableTags = writeTableTags
    ee.initTableTags = initTableTags
    ee.setTableTags = setTableTags
    ee.getTableTags = getTableTags
    ee.updateTableTag = updateTableTag
    return ee
}


export default WSyncWebdataServer
