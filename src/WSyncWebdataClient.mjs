import get from 'lodash-es/get.js'
import each from 'lodash-es/each.js'
import cloneDeep from 'lodash-es/cloneDeep.js'
import genPm from 'wsemi/src/genPm.mjs'
import evem from 'wsemi/src/evem.mjs'
import haskey from 'wsemi/src/haskey.mjs'
import isbol from 'wsemi/src/isbol.mjs'
import ispint from 'wsemi/src/ispint.mjs'
import iseobj from 'wsemi/src/iseobj.mjs'
import cint from 'wsemi/src/cint.mjs'
import delay from 'wsemi/src/delay.mjs'


/**
 * 瀏覽器端之資料同步器
 *
 * @class
 * @param {Object} instWConverClient 輸入通訊服務實體物件，可使用例如WConverhpClient等建立
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {Boolean} [opt.autoPollingTableTagsForActive=false] 輸入是否當使用者活躍時自動進行輪詢布林值，預設false
 * @param {Integer} [opt.pollingIntervalTime=2000] 輸入輪詢強制延遲時間整數，單位ms，預設2000
 * @returns {Object} 回傳前端資料同步物件，可監聽事件refreshTags、refreshState、refreshTable、getData、error，可使用函數setTableTags、updateTableTags、pollingTableTags
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
 *     autoPollingTableTagsForActive: true,
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
function WSyncWebdataClient(initWConverhpClient, opt = {}) {
    let nowTableTags = {}
    let isPolling = false

    //check
    if (!iseobj(initWConverhpClient)) {
        console.log('initWConverhpClient is not an effective object, and set initWConverhpClient to an EventEmitter')
        initWConverhpClient = evem()
    }
    if (!haskey(initWConverhpClient, 'emit')) {
        throw new Error(`initWConverhpClient is not an EventEmitter`)
    }

    //autoPollingTableTagsForActive
    let autoPollingTableTagsForActive = get(opt, 'autoPollingTableTagsForActive')
    if (!isbol(autoPollingTableTagsForActive)) {
        autoPollingTableTagsForActive = false
    }

    //pollingIntervalTime
    let pollingIntervalTime = get(opt, 'pollingIntervalTime')
    if (!ispint(pollingIntervalTime)) {
        pollingIntervalTime = 2000
    }
    pollingIntervalTime = cint(pollingIntervalTime)

    //ee
    let ee = evem()

    //eeEmit
    let eeEmit = (name, ...args) => {
        setTimeout(() => {
            ee.emit(name, ...args)
        }, 1)
    }

    /**
     * 直接設定各資料表時間資料
     *
     * @memberof WSyncWebdataClient
     * @param {Object} tableTags 輸入各資料表時間戳物件
     * @example
     *
     * let tableTags = {...}
     * wsdc.setTableTags(tableTags)
     *
     */
    function setTableTags(tableTags = {}) {
        nowTableTags = tableTags
    }

    /**
     * 主動更新指定資料表之時間戳，當有新的資料表時間戳資料時調用此函數進行更新
     *
     * @memberof WSyncWebdataClient
     * @param {Object} tableTags 輸入各資料表時間戳物件
     * @example
     *
     * let tableTags = {...}
     * wsdc.updateTableTags(tableTags)
     *
     */
    async function updateTableTags(tableTags = {}) {
        let pms = []

        //emit
        eeEmit('beforeUpdateTableTags', {
            oldTableTags: cloneDeep(nowTableTags),
            newTableTags: cloneDeep(tableTags),
        })

        //needToRefresh
        let needToRefresh = false
        each(tableTags, (v, k) => {

            //原有更新時間戳
            let vv = nowTableTags[k]

            //check
            if (vv !== v) {
                needToRefresh = true
            }

        })

        //emit,
        eeEmit('refreshState', {
            needToRefresh,
            oldTableTags: cloneDeep(nowTableTags),
            newTableTags: cloneDeep(tableTags),
        })

        //確認各tags的時間戳
        each(tableTags, (v, k) => {

            //原有更新時間戳
            let vv = nowTableTags[k]

            //check
            if (vv !== v) {

                //pm
                let pm = genPm()

                //tt
                let tt = { tableName: k, timeTag: v, pm }

                //push
                pms.push(pm)

                //emit事件, 外部事件on收到通知時打API去撈指定表數據, 外部由tt.pm回傳成功取得數據或失敗
                eeEmit('refreshTable', tt)

                //wait
                pm
                    .then((data) => {

                        //save
                        nowTableTags[k] = v

                        //emit, 外部事件on可收到API回傳之數據
                        eeEmit('getData', { tableName: k, timeTag: v, data })

                    })
                    .catch((err) => {

                        //emit
                        eeEmit('error', {
                            msg: 'can not get table data: ' + k,
                            err,
                        })

                    })

            }

        })

        //Promise.all
        await Promise.all(pms) //不會有catch

        //emit
        eeEmit('afterUpdateTableTags', {
            oldTableTags: cloneDeep(nowTableTags),
            newTableTags: cloneDeep(tableTags),
        })

    }

    /**
     * 主動觸發輪詢更新各資料表之時間戳
     *
     * @memberof WSyncWebdataClient
     * @example
     *
     * wsdc.pollingTableTags()
     *
     */
    async function pollingTableTags() {

        //check
        if (isPolling) {
            return
        }
        isPolling = true

        //emit
        eeEmit('beforePollingTableTags')

        //pm
        let pm = genPm()

        //emit, 外部事件on收到通知時打API去撈各資料表時間戳, 需通過pm回傳成功取得數據或失敗
        eeEmit('refreshTags', { pm })

        //wait
        let tableTags = await pm
            .catch((err) => {

                //emit
                eeEmit('error', {
                    msg: 'can not get tags data',
                    err,
                })

            })

        //check
        if (tableTags) {

            //updateTableTags
            await updateTableTags(tableTags) //不會有catch

        }

        //強制延遲
        await delay(pollingIntervalTime)

        //emit
        eeEmit('afterPollingTableTags')

        //恢復isPolling
        isPolling = false

    }

    //pollingTableTags
    if (autoPollingTableTagsForActive) {

        //mouseover
        if (typeof window !== 'undefined') {
            window.addEventListener('mouseover', (e) => {
                pollingTableTags()
            }, false)
            window.addEventListener('touchmove', (e) => {
                pollingTableTags()
            }, false)
        }

    }

    //save
    ee.setTableTags = setTableTags
    ee.updateTableTags = updateTableTags
    ee.pollingTableTags = pollingTableTags

    return ee
}


export default WSyncWebdataClient
