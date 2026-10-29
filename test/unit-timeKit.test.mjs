import assert from 'assert'
import debounce from 'wsemi/src/debounce.mjs'
import { traceRec, useFakeClock } from './tools/timeKit.mjs'
import { activeTimers as nTimers } from './tools/syncKit.mjs'


//模組載入時保存之真實計時器: 假時鐘(useFakeClock)會取代globalThis.setTimeout等, 本檔之真實等待與清理一律用保存者
const realSetTimeout = setTimeout
const realClearTimeout = clearTimeout
const realSetInterval = setInterval
const realClearInterval = clearInterval


describe('timeKit useFakeClock', function() {

    it('K1 假時鐘視窗內對視窗前建立之真實計時器呼叫clearTimeout/clearInterval時, 須真正清除(同步量測作用中之計時器數減少)', async function() {
        //規格: node:test之mock.timers取代全域clearTimeout/clearInterval後, 其只認假計時器, 對真實計時器為空操作; useFakeClock須將真實計時器之清除轉交原生函數, 否則視窗內才被清除之真實計時器(如wsemi debounce之偵測計時器停止時自行clearInterval)漏清而行程不退出
        let n0 = nTimers()
        let tt = realSetTimeout(() => {}, 60000)
        let ti = realSetInterval(() => {}, 60000)
        let clock = null
        try {
            assert.strict.equal(nTimers(), n0 + 2)
            clock = useFakeClock(0)
            clearTimeout(tt)
            clearInterval(ti)
            assert.strict.equal(nTimers(), n0)
        }
        finally {
            if (clock) {
                clock.restore()
            }
            realClearTimeout(tt)
            realClearInterval(ti)
        }
    })

    it('K2 假計時器仍由假時鐘控制: advance才觸發, clear可取消, 且不佔真實計時器數; restore後全域函數復原', async function() {
        let orig = { st: globalThis.setTimeout, si: globalThis.setInterval, ct: globalThis.clearTimeout, ci: globalThis.clearInterval, date: globalThis.Date }
        let clock = useFakeClock(0)
        try {
            let n0 = nTimers()
            let hits = []
            setTimeout(() => {
                hits.push('a')
            }, 10)
            let tb = setTimeout(() => {
                hits.push('b')
            }, 10)
            let ti = setInterval(() => {
                hits.push('i')
            }, 4)
            clearTimeout(tb)
            assert.strict.equal(nTimers(), n0) //假計時器不是真實計時器
            await clock.advance(9)
            assert.strict.deepEqual(hits, ['i', 'i'])
            await clock.advance(1)
            assert.strict.deepEqual(hits, ['i', 'i', 'a'])
            clearInterval(ti)
            await clock.advance(100)
            assert.strict.deepEqual(hits, ['i', 'i', 'a'])
        }
        finally {
            clock.restore()
        }
        assert.ok(globalThis.setTimeout === orig.st && globalThis.setInterval === orig.si && globalThis.clearTimeout === orig.ct && globalThis.clearInterval === orig.ci && globalThis.Date === orig.date)
    })

    it('K3 真實合併窗口之偵測計時器於停止時, 其clearInterval落入假時鐘視窗, 仍須被清除(不得留下永久存活之計時器而使行程不結束)', async function() {
        //規格: 測完行程須自行結束. 回歸: 伺服端S1案以真實時鐘排入wsemi debounce, 下一案S1b隨即啟用假時鐘, 偵測計時器見佇列已空時之clearInterval若落入假時鐘視窗而漏清, 該計時器每10ms永久偵測
        let handles = []
        let rec = traceRec()
        let d = null
        let si = globalThis.setInterval
        globalThis.setInterval = (...args) => {
            let h = si(...args)
            handles.push(h)
            return h
        }
        try {
            d = debounce(20, { onTrace: rec.on })
            d(() => {})
        }
        finally {
            globalThis.setInterval = si
        }
        let clock = null
        try {
            assert.strict.equal(handles.length, 1)
            await rec.wait((e) => e.type === 'run') //偵測計時器已執行最後任務, 下一次偵測(10ms後)才見佇列已空而停止
            clock = useFakeClock(0) //此時起之停止偵測落入假時鐘視窗(run事件之續行為microtask, 先於下一次偵測)
            await rec.wait((e) => e.type === 'stop') //停止事件, 其前已呼叫clearInterval
            clock.restore()
            clock = null
            let nStop = rec.types().filter((v) => v === 'stop').length
            //否定斷言之觀察窗: 計時器已清除則不再偵測; 漏清時每10ms再發一次stop
            await new Promise((resolve) => {
                realSetTimeout(resolve, 80)
            })
            assert.strict.equal(rec.types().filter((v) => v === 'stop').length, nStop)
        }
        finally {
            if (clock) {
                clock.restore()
            }
            //測試自己清理, 即使斷言失敗亦不使行程懸置
            for (let h of handles) {
                realClearInterval(h)
            }
        }
    })

})
