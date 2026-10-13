import evEmit from 'wsemi/src/evEmit.mjs'
import evEmitDelay from 'wsemi/src/evEmitDelay.mjs'
import isobj from 'wsemi/src/isobj.mjs'
import isfun from 'wsemi/src/isfun.mjs'


//tag, wsemi於console.error之前綴
let tag = 'w-sync-webdata'


//genEmit, 建立本套件之事件派發函數(內部使用, 前後端共用)
//  一律交由wsemi之evEmit/evEmitDelay派發: 以timer脫勾1ms(維持既有時序)後於新堆疊內以try攔截監聽器之同步拋錯,
//  直接以setTimeout包ev.emit時, 監聽器之同步拋錯即成uncaughtException而殺行程(見wsemi之evem.mjs、evEmit.mjs)
//  輸入ev為事件物件, isCleared為是否已釋放之判斷函數, 已釋放者一律不派發(含釋放前已排程者)
//  回傳emit(一般事件)、emitPm(帶pm之事件)、emitNow(同步派發且不受已釋放之限制, 供釋放時通報自身之錯誤)、clear(取消已排程之派發)
function genEmit(ev, isCleared) {

    //listenerCount, 事件物件無listenerCount時(僅有emit者)視為有監聽者
    let listenerCount = (name) => {
        if (isfun(ev.listenerCount)) {
            return ev.listenerCount(name)
        }
        return 1
    }

    //evf, 交予wsemi之事件物件門面, 使其通報路徑所用之listenerCount對僅有emit之事件物件亦可用
    let evf = {
        emit: (name, ...args) => {
            return ev.emit(name, ...args)
        },
        listenerCount,
    }

    //deliver, 實際派發
    let deliver = (name, ...args) => {

        //非error事件直接派發
        if (name !== 'error') {
            return ev.emit(name, ...args)
        }

        //msg, wsemi對監聽器拋錯之通報形狀為{fun,name,msg,args}, 轉為本套件error事件之形狀{msg,err}
        let msg = args[0]
        if (isobj(msg) && msg.fun === 'listener') {
            msg = {
                msg: `listener of event[${msg.name}] error`,
                err: msg.msg,
            }
        }

        //無error監聽者時改以console.error輸出, 失敗不可無聲, 且Node之EventEmitter於無監聽者時emit('error')會拋錯
        if (listenerCount('error') === 0) {
            console.error(`[${tag}]`, msg)
            return false
        }

        return ev.emit('error', msg)
    }

    //ts, 已排程之派發計時器, 釋放時取消
    let ts = new Set()

    //schedule, 以evEmitDelay排程派發並登記計時器
    let schedule = (name, args, opt) => {
        let t = null
        let funEmit = opt.funEmit
        t = evEmitDelay(evf, name, args, {
            ...opt,
            tag,
            funEmit: (nm, ...a) => {
                ts.delete(t)
                return funEmit(nm, ...a)
            },
        })
        ts.add(t)
    }

    //emit, 一般事件
    let emit = (name, ...args) => {

        //check, 已釋放者不再排程
        if (isCleared()) {
            return
        }

        schedule(name, args, {
            funEmit: (nm, ...a) => {

                //check
                if (isCleared()) {
                    return false
                }

                return deliver(nm, ...a)
            },
        })
    }

    //emitPm, 帶pm之事件(pm位於第1個參數之pm欄位), opt.beforeDispatch為派發當下之判斷函數, 回傳false則不派發
    //  無人接聽、或監聽器於結算pm前同步拋錯時皆reject該pm, 使流程必定終結, 該次失敗之error由pm之流程發出唯一一則
    //  監聽器已結算pm後才拋錯者, 照常通報監聽器錯誤, 不可吞掉
    let emitPm = (name, data, opt = {}) => {
        let pm = data.pm

        //check, 已釋放者不再排程
        if (isCleared()) {
            return
        }

        //包裝pm之resolve與reject, 同步記錄是否已結算
        let settled = false
        let settledBySelf = false
        let resolve0 = pm.resolve
        let reject0 = pm.reject
        pm.resolve = (v) => {
            settled = true
            resolve0(v)
        }
        pm.reject = (err) => {
            settled = true
            reject0(err)
        }

        schedule(name, [data], {
            funSettle: (err) => {

                //check, 監聽器已結算者不改其結果
                if (settled) {
                    return
                }

                settled = true
                settledBySelf = true
                reject0(err)
            },
            funEmit: (nm, ...a) => {

                //監聽器拋錯之通報
                if (nm !== name) {

                    //check, 已由funSettle轉為pm之reject者, 由pm之流程發出唯一一則error
                    if (settledBySelf) {
                        return true
                    }

                    //check
                    if (isCleared()) {
                        return false
                    }

                    return deliver(nm, ...a)
                }

                //check
                if (isCleared()) {
                    return false
                }

                //check
                if (isfun(opt.beforeDispatch) && opt.beforeDispatch() === false) {
                    return false
                }

                //check, 無人接聽即reject, 否則pm永無人結算而流程懸置
                if (listenerCount(nm) === 0) {
                    settled = true
                    settledBySelf = true
                    reject0(new Error(`no listener for event[${nm}]`))
                    return false
                }

                return ev.emit(nm, ...a)
            },
        })
    }

    //emitNow, 同步派發且不受已釋放之限制
    let emitNow = (name, ...args) => {
        return evEmit(evf, name, args, {
            tag,
            funEmit: deliver,
        })
    }

    //clear, 取消已排程之派發
    let clear = () => {
        ts.forEach((t) => {
            clearTimeout(t)
        })
        ts.clear()
    }

    return {
        emit,
        emitPm,
        emitNow,
        clear,
    }
}


export default genEmit
