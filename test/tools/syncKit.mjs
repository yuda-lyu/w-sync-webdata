//syncKit.mjs: 本套件事件同步型測試之共用工具, 規則見sgud/rule/rulebook.md之R-TRACE-01
//  fence: 排程次序柵欄, 以與被測物同一機制(wsemi之evEmitDelay, 1ms計時器)排入一個哨兵, 同為1ms之計時器依排入先後觸發, 故fence完成時先前已排程之事件皆已派發完畢; 用於「確認某事件不會再來」之否定斷言, 不依賴經過多少毫秒
//  within: 防懸置上限, 以模組載入時保存之真實計時器計時(假時鐘下亦會觸發), 逾時reject; 只防懸置, 須遠大於正常耗時, 不可用來表達規格之時間要求
import evEmitDelay from 'wsemi/src/evEmitDelay.mjs'


const realSetTimeout = setTimeout
const realClearTimeout = clearTimeout


/**
 * 排程次序柵欄
 *
 * @returns {Promise} 回傳Promise, 於柵欄之前已用evEmitDelay(同為1ms)排程之事件皆已派發後resolve
 */
function fence() {
    return new Promise((resolve) => {
        evEmitDelay({ emit: () => {} }, 'fence', [], {
            funEmit: () => {
                resolve()
            },
        })
    })
}


/**
 * 為Promise加上防懸置上限
 *
 * @param {Promise} pm 輸入Promise
 * @param {String} [label=''] 輸入逾時時顯示之標籤
 * @param {Number} [guard=20000] 輸入防懸置上限毫秒數
 * @returns {Promise} 回傳Promise, pm先結算則同其結果, 逾時則reject
 */
function within(pm, label = '', guard = 20000) {
    let t = null
    let guardPm = new Promise((resolve, reject) => {
        t = realSetTimeout(() => {
            reject(new Error(`within: [${label}] not settled within ${guard}ms`))
        }, guard)
    })
    return Promise.race([pm, guardPm]).finally(() => {
        realClearTimeout(t)
    })
}


/**
 * 目前作用中(未unref)之計時器數, 同步量測
 *
 * 用於「釋放後計時器回到原值」之斷言: 前後兩次量測之間不讓出事件迴圈(無await), 他處之計時器不會在其間到期, 故不受負載影響; 假時鐘之假計時器不計
 *
 * @returns {Number} 回傳作用中之計時器數
 */
function activeTimers() {
    return process.getActiveResourcesInfo().filter((v) => v === 'Timeout').length
}


/**
 * 取得作用中之計時器數作為settleTimers之基準
 *
 * mocha對回傳promise之案/hook(含async函式)於其回傳promise後才建立逾時計時器(未unref, 計入作用中之計時器), 故同步段量測之數字不含該計時器, 與其後(已讓出)之settleTimers量測差1; 本函數先讓出一次microtask再量測, 使基準與其後之量測在同一狀態(案/hook自己的逾時計時器皆已建立)
 *
 * @returns {Promise<Number>} 回傳作用中之計時器數
 */
async function baselineTimers() {
    await null
    return activeTimers()
}


/**
 * 等作用中之計時器數回到基準, 逾防懸置上限仍未回到者拋錯
 *
 * 測完仍有計時器存活時行程不會結束(mocha不加--exit), 與其整個執行懸置, 不如在該測試檔結束時失敗並指出; 基準須由baselineTimers取得(與本函數同在案/hook已讓出之狀態, 皆含mocha自身之逾時計時器; 同步段量測之數字不含, 直接比較會差1而偶發失敗); 輪詢與防懸置上限用模組載入時保存之真實計時器
 *
 * @param {Number} n0 輸入基準計時器數
 * @param {String} [label=''] 輸入失敗時顯示之標籤
 * @param {Number} [guard=15000] 輸入防懸置上限毫秒數
 * @returns {Promise} 回傳Promise, 計時器數回到基準時resolve
 */
async function settleTimers(n0, label = '', guard = 15000) {
    await null //先讓出一次microtask, 使呼叫端(案/hook)之mocha逾時計時器已建立, 與baselineTimers之基準同一狀態
    let t0 = performance.now()
    let isDumped = false
    while (activeTimers() > n0) {
        //負載試驗(loadTrial --diag)時, 等了一陣仍未回到基準即存當下快照(仍存活資源之建立堆疊), 供定位
        if (!isDumped && performance.now() - t0 > 2000 && typeof globalThis.__ltDiagDump === 'function') {
            isDumped = true
            globalThis.__ltDiagDump(`settle-${label}`)
        }
        if (performance.now() - t0 > guard) {
            throw new Error(`settleTimers: [${label}] ${activeTimers()} timers still alive (baseline ${n0}) after ${guard}ms, the process would not exit`)
        }
        await new Promise((resolve) => {
            realSetTimeout(resolve, 10)
        })
    }
}


export {
    fence,
    within,
    activeTimers,
    baselineTimers,
    settleTimers
}
