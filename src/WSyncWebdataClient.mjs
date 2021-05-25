import each from 'lodash/each'
import genPm from 'wsemi/src/genPm.mjs'
import cint from 'wsemi/src/cint.mjs'
import cbol from 'wsemi/src/cbol.mjs'
import delay from 'wsemi/src/delay.mjs'
import Evem from 'wsemi/src/evem.mjs'


/**
 * 伺服器端之資料同步器
 *
 * @class
 * @param {Object} [opt={}] 輸入設定物件，預設{}
 * @param {Boolean} [opt.usePollingTableTags=false] 輸入是否用前端輪詢取得各資料表時間戳布林值，預設false
 * @param {Integer} [opt.pollingIntervalTime=2000] 輸入每次輪詢間隔之最小毫秒整數，預設2000
 * @returns {Object} 回傳前端資料同步物件，可監聽事件refreshTags、refreshTable、getData、error，可使用函數updateTableTags、pollingTableTags
 * @example
 */
function WSyncWebdataClient(opt = {}) {
    let nowTableTags = {}
    let isPolling = false


    //default
    if (!opt.usePollingTableTags) {
        opt.usePollingTableTags = false
    }
    else {
        opt.usePollingTableTags = cbol(opt.usePollingTableTags)
    }
    if (!opt.pollingIntervalTime) {
        opt.pollingIntervalTime = 2000
    }
    else {
        opt.pollingIntervalTime = cint(opt.pollingIntervalTime)
    }


    //ee
    let ee = new Evem()


    //eeEmit
    function eeEmit(name, ...args) {
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
     * let tableTags = {...}
     * wsdc.setTableTags(tableTags)
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
     * let tableTags = {...}
     * wsdc.updateTableTags(tableTags)
     */
    async function updateTableTags(tableTags = {}) {
        let pms = []

        //calc
        each(tableTags, (v, k) => {

            //原有更新時間戳
            let vv = nowTableTags[k]

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

    }


    /**
     * 主動觸發輪詢更新各資料表之時間戳
     *
     * @memberof WSyncWebdataClient
     * @example
     * wsdc.pollingTableTags()
     */
    async function pollingTableTags() {

        //check
        if (isPolling) {
            return
        }
        isPolling = true

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

        //延遲opt.pollingIntervalTime毫秒
        await delay(opt.pollingIntervalTime)

        //恢復isPolling
        isPolling = false

    }


    //pollingTableTags
    if (opt.usePollingTableTags) {

        //mouseover
        if (typeof window !== 'undefined') {
            window.addEventListener('mouseover', (e) => {
                pollingTableTags()
            }, false)
        }

    }


    ee.setTableTags = setTableTags
    ee.updateTableTags = updateTableTags
    ee.pollingTableTags = pollingTableTags
    return ee
}


export default WSyncWebdataClient
