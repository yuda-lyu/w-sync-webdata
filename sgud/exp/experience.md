# 累積經驗

本檔為執行工作時特有之累積經驗,留給後續之嘗試、執行與判斷,由agent自行編列、擴充與維護.

格式:每條寫[情境 → 事實(附證據) → 做法],日期一律絕對日期.

## 一、前端同步批次與帶 pm 之事件

### E01 批次不可直接 await 原始 pm(2026-10-13 已修)

- 情境:`updateTableTags` 原以 `await Promise.all(原始pm)`,註解「不會有catch」.
- 事實:本套件 README 範例本身就教監聽器失敗時 `pm.reject(err)`.一表 reject 即使批次 reject;w-serv-webdata 前端 `WServWebdataClient.mjs:284` 呼叫時未 await 未 catch,成為 unhandledRejection(Node 下行程 exit 1);`afterUpdateTableTags` 不發;`pollingTableTags` 之 `isPolling` 永不復原(實測連呼 3 次只輪詢 1 次).他表之 getData 與時間戳**不受影響**(提出方建議書「其餘表一併中斷」不成立).
- 做法:批次只等各表「已處理成敗之結算」(恆 resolve);結算鏈末端再接 catch;`updateTableTags`、`pollingTableTags` 整體 try/catch(/finally).

### E02 同表重疊請求不可採「只有最新請求可提交」(2026-10-13)

- 情境:為避免後發先至時時間戳倒退.
- 事實:上層每則推播都帶**全部**同步表之時間戳(w-serv-webdata `WServWebdataServerSync.mjs:71-74`),w-serv-broadcast 前端一輪多則逐則派發(`WServBroadcastClient.mjs:119-123`),所以同表同 tag 之重疊是常態.以請求身分判斷時,同 tag 持續重送下成功回應全被丟棄(審查者實測 15 次請求 0 筆送達;持續推播 2 秒 0 則 getData).
- 做法:單調提交(回應之序號大於該表已提交序號才提交)、只有該表最新請求且該 tag 尚未提交時才報錯、1ms 派發前已被取代者不派發(批次跟隨最新請求)、已派發才被取代者立即結束其批次之等待、批次目標回到已提交 tag 時使進行中之其他 tag 請求失效.

### E03 帶 pm 事件:必終結,但不可吞錯(2026-10-13)

- 事實:
  - 無監聽器或監聽器同步拋錯時 pm 無人結算,批次懸置.
  - 若對帶 pm 事件之 wsemi 通報**一律**抑制,監聽器「先 resolve 再拋錯」時例外完全消失(三位審查之原型皆重現).
  - 原生 Promise 一旦 `pm.resolve(另一個pending promise)`,之後 `pm.reject` 無效(審查者實測),所以「釋放時 reject 所有 pm」不可達.
- 做法:`src/genEmit.mjs` 之 `emitPm` 包裝 `pm.resolve/reject` 同步記錄是否已結算,只在本模組因監聽器拋錯或無人接聽而結算時抑制通報;釋放與逾時以內部完成通道結束等待,不 reject 外部 pm.

### E04 登記表只留各表最新請求(2026-10-13)

- 事實:以集合持有所有進行中 pm 時,監聽器永不結算之 pm 永遠可達(`--expose-gc` 實驗 200/200 可達);原版反而可被回收.改為「各表最新一筆」後 0/200 可達.
- 做法:被取代之請求不再由本套件持有;驗證法為連推 200 次、監聽器以 WeakRef 觀察 pm 而不結算,`globalThis.gc()` 後數可達者.

## 二、派發與事件物件

### E05 方法掛在共用事件物件上,名稱要帶層名(2026-10-13)

- 事實:同一物件被 w-converhp(`ev.stop`,`WConverhpServer.mjs:2226`)、w-serv-broadcast(`getClients`、`getMessages`、`broadcast`、`clearBroadcast`)與本套件掛方法;w-serv-broadcast 之建議書也提議在同一物件加 `dispose()`.取名 `stop` 會覆蓋 w-converhp 之關閉函數.
- 做法:釋放介面取 `clearSync`(對齊 `clearBroadcast`).新增任何掛載方法前,先 grep 各層之 `ev.xxx =`、`instWConverServer.xxx =`、`instWConverClient.xxx =`.

### E06 error 事件之兩種無聲(2026-10-13)

- 事實:eventemitter3 對無監聽者之 `emit('error')` 只回 false(失敗無聲);Node EventEmitter 則拋 `ERR_UNHANDLED_ERROR`.wsemi `evEmit` 之通報路徑呼叫 `ev.listenerCount('error')`(`evEmit.mjs:92`),傳入只有 emit 之物件時會拋錯而只剩 console.
- 做法:本套件自發之 error 二擇一(有監聽者 emit,否則 `console.error('[w-sync-webdata]', …)`);交給 wsemi 之物件以門面提供 `listenerCount`(不可得時視為有監聽者).

### E07 timer 內派發一律經 wsemi evEmitDelay(2026-10-13 已修)

- 事實:原 `eeEmit` 以 `setTimeout` 包原生 `emit`(前後端各一份),監聽器同步拋錯即成 uncaughtException(Node exit 1).wsemi `evem.mjs:17-18` 明訂此情形應於派發處以 evEmit/evEmitDelay 攔截.
- 做法:收斂為 `src/genEmit.mjs`(小寫開頭,不成為 dist 入口,`toolg/gDistRollup.mjs:9-11` 只取大寫 W 開頭者),保持 1ms 脫勾以維持既有時序.

## 三、伺服端落檔

### E08 o2j 序列化失敗回空字串(2026-10-13 已修)

- 事實:`wsemi/src/o2j.mjs:15` 註明失敗(BigInt、循環參照)回空字串;直接 `writeFileSync` 會把時間戳檔截空且無 error(審查者實測).
- 做法:`o2j(v, false, { returnWithStateAndMsg: true })` 判斷 state,失敗不寫檔、不清待寫旗標、發 error.

### E09 釋放時之落檔要比對檔案仍屬本實體(2026-10-13)

- 事實:若釋放時無條件落檔,「先建新實體、後釋放舊實體」會以舊狀態覆寫新檔(審查者實測).w-serv-webdata 只用 `useInputOnly` 且不讀回檔案,但使用讀檔模式之使用端會因此在重啟後拿到舊時間戳.
- 做法:記住本實體最後寫入之內容,釋放時檔案不存在或內容相同才寫.

## 四、測試與驗收

### E10 既有指紋測試依賴預設 ./tableTags.json(2026-10-13)

- 事實:`test/syncdata.test.mjs` 以預設路徑 `./tableTags.json`(受版控)並以 `useInputFirst` 讀回;`--parallel` 下任何寫入預設路徑之測試都會改變其指紋第一行(審查者實測).該檔每次 `npm test` 都會被重寫(內容恰與版本庫相同).
- 做法:新測試之伺服端實體一律指定 `fpTableTags` 於 `test/_tmp/<案名>/`,於 after 刪除.

### E11 測試共用層不可掛會改變受測行為之監聽器(2026-10-13)

- 事實:測試共用函數若預設替 `refreshTable` 掛記錄用監聽器,「無監聽器」之路徑永遠走不到.
- 做法:共用層只記錄不帶 pm 之事件;需要記錄 refreshTable 者於其回覆監聽器內自行記錄.

### E12 下游整合驗收之作法(2026-10-13)

- 事實:w-serv-webdata 之 `test/api-servdata.test.mjs` 不驗同步(recvData 為空函數),且寫入其受版控之 `db.json`、`tableTags.json`、固定埠 9000;w-serv-hapi 之 `test/api-table-tags.test.mjs` 只驗伺服端落檔.w-serv-hapi 之 `test/api-exec.test.mjs` 才有「同步推送至前端」與「全程不應發生error事件」之斷言.w-serv-webdata 之 repo 可能正被其主責 agent 修改.
- 做法:以 `node --import <掛鉤>`(`module.registerHooks` 之 resolve,把 `w-sync-webdata/src/*` 解析到本 repo src,並於 stderr 印出實際解析之絕對檔)跑 w-serv-hapi 之 api-exec、api-authorize、api-options、api-table-tags,原版與改後版各跑一次比對;執行器以 `spawn` 之 cwd 參數進入下游 repo,不 `cd`.需要真實堆疊時引用 w-serv-hapi `node_modules` 內之 w-serv-webdata,產物落本 repo `./tmp`.

### E13 Node 與瀏覽器之驗法(2026-10-13)

- Node 下測 window 監聽:`isWindow` 要求 `window.document`,樁 `globalThis.window = { document: {}, addEventListener, removeEventListener }`,測後 `delete`.
- 真瀏覽器:Playwright 在技能根之 `node_modules`;UMD 前端包之全域名為 `globalThis['w-sync-webdata-client']`;以 `page.mouse.move` 觸發 window 之 mouseover.dist 要驗時以 `w-package-tools/src/rollupFiles.mjs` 輸出到 `./tmp/…`,不動 `./dist`(其 `fdTar` 會被清空).

### E14 檔案格式與 lint(2026-10-13)

- 原始碼為 CRLF(`.editorconfig` 之 `end_of_line = crlf`).以腳本替換時先轉 LF、斷言每個替換目標恰出現一次、最後轉回 CRLF.
- eslint 8 對目錄預設不比對 `.mjs`,須指名檔案:`./node_modules/.bin/eslint src/*.mjs test/*.mjs`.規則 `promise/param-names` 要求 Promise 建構子之參數名為 resolve.

## 五、計時器相關之測試(2026-10-29,tm-syncwebdata)

### E15 測試鎖排隊可逾數小時,不可把需要鎖的工作派給前景子代理(2026-10-29)

- 情境:本輪 06:23 起以 `quiet-run --lock` 排隊跑測試,他套件(w-serv-broadcast、w-data-syncer、w-converhp、w-serv-orm 等)連續以 `--lock-exclusive` 跑負載試驗,`exclusive-pending.txt` 又擋住所有新的 `--lock` 請求;派出的前景子代理(需跑測試)等鎖 8951494ms(約 2.5 小時)仍未取得,主責 agent 的單次 4 小時額度幾乎耗盡(自行再排的 chain 於 09:41 才取得鎖,距上限僅 20 分鐘),改造後負載試驗與大半變異未及實跑.
- 事實:`C:\opensrcOper\tmp\locks\` 有 `web-tests`、`web-tests-b` 兩槽與 `exclusive-pending.txt`;獨佔持有者輪流跑 15~60 分鐘;基準本身的獨佔鎖等了 9m20s.
- 做法:①動工前先 `ls C:/opensrcOper/tmp/locks` 看佇列;②需要鎖的工作自己串成**一個** chain 腳本(`tmp/tm-syncwebdata/chainTest.mjs`、`mutate.mjs`、`chainLoad.mjs`),排隊後先做不需鎖的工作(讀碼、改碼、eslint、文件、乾跑變異可套用性);③子代理只改檔、不跑測試(或明令不排鎖),測試由主責 agent 以單一 chain 跑;④排鎖的背景指令 `timeout` 給足(7200000),但不要讓前景子代理占住回合.

### E16 時序指紋案 `syncdata.test.mjs` 為本套件負載下最不穩的案(2026-10-29)

- 事實:盤點明細表未列(排程動作判 A),但改造前基準 CPU 壓力 8 行程 3/10 失敗、事件迴圈阻塞 400:1000 為 10/10 失敗(各動作間隔僅數十 ms,如 getAPIData before tabB@961ms 與 updateTableTag tabA@1000ms)、重度阻塞 1500:3000 反而 0/8(阻塞同時延後全部計時器,相對次序不變).
- 做法:時間本身是規格者用假時鐘(`useFakeClock`),`advance(2000)` 後比對原指紋序列;wsemi `debounce` 每 10ms 偵測,各 flush 約在 710/960/1210ms,指紋序列與 lodash 版相同.

### E17 wsemi `debounce` 無 `cancel`,且觸發時刻為 200~210ms(2026-10-29)

- 事實:`wsemi/src/debounce.mjs` 以 `setInterval(10)` 偵測、`tDiff > ms` 才執行最後一筆任務,無 `cancel`;釋放後已排入之任務會在屆滿時執行.
- 做法:任務內先檢查 `isCleared`(`updateTableTagFlush`),觀察回調轉發前亦檢查;偵測計時器至多再存活約 210ms 後自停(佇列空時 `clearInterval`).假時鐘案以「推進 199ms 尚未 flush、再推進超過 10ms 後 flush」表達窗口,不寫死 200ms 整.

### E18 以同機制之哨兵作排程次序柵欄(2026-10-29)

- 事實:本套件公開事件皆經 wsemi `evEmitDelay`(1ms `setTimeout`),同為 1ms 的計時器依排入先後觸發.
- 做法:`test/tools/syncKit.mjs` 的 `fence()` 以同一機制排一個哨兵,完成時代表其前已排程的公開事件皆已派發;用於否定斷言(確認某事件不再發生)與「批次結束後收尾」,取代 `sleep(10~30)`.肯定斷言仍以被測物事件或觀察回調事件同步.假時鐘下 `fence` 需 `advance`.

### E19 「測完不退出」之根因:假時鐘視窗漏清真實計時器(2026-10-29,tm-syncwebdata2)

- 情境:改造後事件迴圈阻塞 400:1000 第 4 次 mocha 報 72 passing、0 failing 後掛住 50 分鐘.
- 診斷:`test/tools/loadPreload.mjs` 加 `WSEMI_LT_DIAG`(async_hooks 登記計時器/socket 之建立堆疊,每秒寫快照),`loadTrial.mjs` 加 `--diag`、`--hang-sec`(報告寫出後逾秒數未結束即判失敗並樹殺).同條件 30 次中 6 次不退出,無負載 10 次中 1 次不退出;7 份快照皆只剩一個 `Timeout`(idle=10、repeat=10),建立於 wsemi `debounce.mjs:148`(`detect` 之 `setInterval`)←`WSyncWebdataServer.mjs:528` ←`unit-WSyncWebdataServer.test.mjs:108`(S1 案).
- 機制:S1 案以真實時鐘排入 debounce,flush 後下一次偵測(約 10ms 後)才見佇列已空而 `clearInterval(t)`;mocha 隨即跑 S1b,`useFakeClock` 啟用 `mock.timers`,若該次偵測落入假時鐘視窗,取代後之全域 `clearInterval` 對真實計時器為空操作(`node:test` 原始碼 `#clearTimer` 只處理 `priorityQueuePosition !== undefined` 者),`t=null` 後該真實 interval 每 10ms 永久偵測,行程不退出.是否落入視窗取決於 libuv 同一輪計時器階段與 `setImmediate`(mocha 排下一案)之次序,故約 10~20% 隨機出現,與負載有關但無負載亦出現.
- 判定:**測試缺陷**(假時鐘工具未處理視窗內對真實計時器之清除),非產品缺陷——產品之 debounce 在無 mock 時必自停.不以 `--exit` 掩蓋.
- 做法:`useFakeClock` 以 WeakSet 登記視窗內建立之假計時器,clear 時假者交 `mock.timers`、其餘轉交原生 clear;決定性重現與修後對照見 `tmp/tm-syncwebdata2/repro-leak.mjs`(raw 直接用 mock.timers 恆漏清,kit 不漏);回歸 `unit-timeKit.test.mjs` K1~K3;各測試檔 `after` 以 `settleTimers` 在洩漏時失敗而非懸置.
- 通則:凡把真實計時器與 `mock.timers` 假時鐘並用之測試,都要問「視窗前建立、視窗內才被清除/觸發之真實計時器會怎樣」;repeat 型計時器(setInterval)漏清即永久懸置,單次型只是多存活一次.

### E20 以同步量測斷言「clearSync 後計時器回到原值」(2026-10-29)

- 事實:`process.getActiveResourcesInfo()` 每個未 unref 的 `Timeout` 各算一筆;兩次量測之間不 `await`(或僅 microtask 續行)時,他處計時器不會到期,數字為決定性,負載下亦同.
- 做法:`syncKit.activeTimers()`;前端 K7(已排程之派發被 `clearEmit` 取消,排程後 `> n0`、釋放後 `=== n0`)、K7b(`delayStart` 事件之續行為 microtask,釋放後恰少 1 筆強制延遲計時器)、K7c(`refreshTimeout` 等待上限計時器恰少 1 筆).被 C19、C11、C22 三個變異擊殺,其中 C11 前一輪判為等價(讀碼推論),實為可觀察的(計時器多存活至逾時).
- 限制:伺服端 wsemi `debounce` 無 `cancel`,偵測計時器無法在 `clearSync` 當下取消,只能以 `settleTimers` 等其自停(S23).
- 陷阱(S23 曾於事件迴圈阻塞下 3/100 偶發失敗):mocha 對 async 案/hook 於其**回傳 promise 後**才建立逾時計時器(`Runnable.resetTimeout`,未 unref,計入 `getActiveResourcesInfo` 之 `Timeout`),同步段量測 0、第一次 `await` 後為 1;以同步段取基準、讓出後再比較會恆差 1.診斷:`loadPreload` 之 `__ltDiagDump` 於 `settleTimers` 等逾 2 秒時存快照,失敗當下僅餘 mocha 自身逾時計時器(`idle=180000`)與輪詢計時器,debounce 偵測計時器已停(產品無誤).改為 `baselineTimers()`(讓出一次後量測)與 `settleTimers`(起首讓出一次)同狀態比較,修後伺服端測試檔於阻塞 400:1000 下 0/150 失敗.純 delta 式斷言(K7 系列,前後之間不 `await`)不受此影響.

### E21 單獨存活之變異用「成對變異」以實驗判等價(2026-10-29)

- 做法:兩道防線重疊者(C20 與 C11、S03 與 writeTableTags/genEmit 之已釋放檢查、G01 與派發當下檢查),單獨移除任一道皆存活;成對移除(`mutate.mjs` 之 P01~P04)若被既有案擊殺,即證明該案抓得到此行為、單獨存活為設計重疊而非測試缺口.不以讀碼推論代替.