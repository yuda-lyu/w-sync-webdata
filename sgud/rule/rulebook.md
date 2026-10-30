# 規則帳本

本檔為套件設計與開發階段之規則帳本,為要求程式碼須長成什麼樣,或由規格產出之測試(項目/說明/流程)有哪些,包含軸、單一擁有者、已知限制、破壞性變更紀錄,以及對應是哪些測試檔案或指令等,由agent自行編列、擴充與維護.

- 盤點指令一律於 repo 根執行;`git grep` 只搜追蹤中檔案,新檔未提交前須加 `--untracked`(例如 `src/genEmit.mjs`).
- 跑單一測試檔:`npx mocha --no-parallel "test/<檔名>" --timeout 180000`;全部:`npm test`.
- Lint:`./node_modules/.bin/eslint src/*.mjs test/*.mjs`(eslint 8 對目錄預設不比對 .mjs).
- 站點判準三種:已套/未套/刻意不套(附理由).
- 建立日期:2026-10-13(依 w-serv-hapi 之 `建議w-sync-webdata修正.md` 07:02 改版、三位獨立審查之結論).

## 0. 軸

| 軸 | 成員 | 取得方式 |
|---|---|---|
| 帶 pm 之事件 | `refreshTable`(各表取資料)、`refreshTags`(輪詢取時間戳) | `git grep -n --untracked "eeEmitPm(" -- src` |
| 一般事件 | 前端 `beforeUpdateTableTags`、`refreshState`、`getData`、`afterUpdateTableTags`、`error`;伺服端 `changeTableTags`、`error` | `git grep -n --untracked "eeEmit('" -- src` |
| 回覆結局 | resolve、reject、監聽器回覆前同步拋錯、回覆後同步拋錯、無監聽器、永不結算、async 監聽器 | — |
| 並發 | 同表不同 tag 重疊、同表同 tag 持續重送、同一時刻多則推播、目標回到已提交 tag、輪詢與推播交錯 | — |
| 事件物件 | eventemitter3(evem)、Node EventEmitter、只有 emit(無 listenerCount) | — |
| 公開寫入入口 | 前端 setTableTags、updateTableTags、pollingTableTags;伺服端 initTableTags、setTableTags、updateTableTag、writeTableTags | `git grep -n --untracked "instWConver\(Client\|Server\)\.[a-zA-Z]* = " -- src` |
| 生命週期 | 釋放前、釋放後、釋放時有待寫、已排程之派發、等待中、延遲中、先建新後停舊 | — |
| 環境 | Node、瀏覽器 | — |

## 1. 規則

### R1 前端批次恆不 reject,afterUpdateTableTags 必發

- 規則:`updateTableTags` 只等各表「已處理成敗之結算」(`refreshTable` 回傳之內部完成 promise,恆 resolve);結算鏈末端接 catch;函數本體整體 try/catch,catch 只發 error.回傳值維持 undefined.
- 單一擁有者:`src/WSyncWebdataClient.mjs` 之 `refreshTable`、`updateTableTags`.
- 盤點:`git grep -n --untracked "Promise.all\|Promise.race" -- src` → 只有 updateTableTags 之 `Promise.all(pms)`(pms 皆為內部完成 promise)與 pollingTableTags 之 `Promise.race`(皆不 reject).
- 測試:`test/unit-WSyncWebdataClient.test.mjs` 之 B1、C1、C2(兩條)、C11.

### R2 帶 pm 之事件必終結,且不吞錯

- 規則:無監聽器(派發當下 `listenerCount===0`)或監聽器於回覆前同步拋錯時,以該錯誤 reject 該 pm,由 pm 之流程發唯一一則 error;監聽器已回覆後才拋錯者,照常以 `listener of event[X] error` 通報.判斷依包裝後之 `pm.resolve/reject` 同步記錄.
- 單一擁有者:`src/genEmit.mjs` 之 `emitPm`.
- 盤點:`git grep -n --untracked "eeEmitPm(" -- src` → refreshTable(`WSyncWebdataClient.mjs` 約 :378)、refreshTags(約 :612),皆已套.
- 測試:C3(三條:回覆前拋錯、回覆後拋錯、多監聽器)、C4、P5/P6.

### R3 計時器內派發一律經 genEmit(evEmitDelay)

- 規則:不得以 `setTimeout` 包原生 `emit`;本套件之 `.emit(` 只出現於 `src/genEmit.mjs`.保持 1ms 脫勾(既有時序).釋放後不再排程,已排程者於釋放時 clearTimeout.
- 盤點:`git grep -n --untracked "\.emit(" -- src` → 只有 genEmit 之 deliver、emitPm 之派發(已套);`git grep -n --untracked "setTimeout" -- src` → 前端 refreshTimeout 計時器、輪詢逾時、輪詢延遲三處,皆非派發(刻意不套).
- 測試:L1、L2、S4、S5、K6、S16;既有 `test/syncdata.test.mjs`(時序指紋).

### R4 本套件自發之 error 二擇一

- 規則:有 error 監聽者就 emit,否則 `console.error('[w-sync-webdata]', 內容)`;交給 wsemi 之事件物件以門面提供 listenerCount(不可得時視為有監聽者).error 內容形狀 `{ msg, err }`,各表失敗另含 `tableName`、`timeTag`.
- 單一擁有者:`src/genEmit.mjs` 之 `deliver`、`evf`.
- 測試:L4、S22、N2(Node EventEmitter)、N3(只有 emit 之物件).

### R5 同表提交規則

- 規則:
  1. 單調提交:回應之請求序號大於該表已提交序號才提交(推進時間戳、發 getData).
  2. 只有該表最新請求、且該 tag 尚未提交時,失敗才發 error.
  3. 1ms 派發當下已被同表較新請求取代者不派發,其等待跟隨最新請求.
  4. 已派發才被取代者,其批次立即結束等待(晚到結果仍依 1 提交).
  5. 批次目標等於已提交 tag 而進行中為其他 tag 時,該請求失效(不得提交)並結束等待.
- 單一擁有者:`refreshTable`(1–4)、`updateTableTags` 第二個迴圈之 else(5).
- 測試:C6、C7、C8、C12(同 tag 持續重送不飢餓)、C13(同一時刻多則推播合併)、C14、C15.

### R6 公開寫入入口檢核輸入

- 規則:時間戳物件之 null 視同 `{}`(前端 updateTableTags 之 null 維持原酬載不迭代),其他非純物件(wsemi `isobj` 為假)發 error 且不作用;伺服端 `updateTableTag` 之表名非有效字串發 error 且不作用;前端 `updateTableTags` 入口快照,判斷、請求與事件皆以快照為準.
- 站點(`git grep -n --untracked "msg: 'invalid" -- src`):前端 setTableTags、updateTableTags(輪詢之回覆經此),伺服端 initTableTags、setTableTags、updateTableTag(已套);伺服端 writeTableTags(刻意不套:無輸入).
- 測試:B4、B5/B6、B7、K8、P2、P3、S20.

### R7 釋放語意(clearSync)

- 規則:兩端冪等;之後寫入類函數不作用、不再派發任何事件(含已排程者).前端另移除 window 具名監聽、結束各表與輪詢之等待與延遲(不 reject 外部 pm).伺服端另 cancel debounce,有待寫者於檔案不存在或仍為本實體最後寫入之內容時同步落檔,落檔失敗以 `emitNow` 同步發一則 error.
- 單一擁有者:兩端之 `clearSync`;閘門在 `genEmit`.
- 盤點:`git grep -n --untracked "if (isCleared\|if (isPolling || isCleared\|if (isCleared())" -- src` → 前端 setTableTags、refreshTable 結算、updateTableTags、pollingTableTags、clearSync;伺服端 writeTableTags、initTableTags、setTableTags、updateTableTag、clearSync;genEmit 之各派發點(已套).伺服端 readTableTags、getTableTags(刻意不套:讀取類照常).
- 測試:K1–K6、C9/P8、P12、S10–S16、S18、S21、S23–S25(`cancel` 取消合併窗口之偵測計時器,見 R11 規則 5、7).

### R8 伺服端落檔

- 規則:先以 `o2j(…, false, { returnWithStateAndMsg: true })` 序列化,失敗不寫檔、不清待寫旗標、發 error;寫入成功才記錄最後寫入內容並清待寫旗標.
- 單一擁有者:`writeTableTagsCore`.
- 測試:S6、S15、S19.

### R9 輪詢

- 規則:`isPolling` 於 finally 復原;進行中重入直接返回;等待期間若已有 updateTableTags 套用新時間戳則捨棄本次回覆;強制延遲用可取消之計時器;回覆假值略過.
- 測試:P1/P4、P2、P3、P9、P11、P12、T2.

### R10 可選等待上限 refreshTimeout

- 規則:預設 0 不限(不替使用端猜時長);>0 時自派發起計時,逾時只結束等待並發 error(`refreshTable timeout[Nms]`、`refreshTags timeout[Nms]`),逾時後才到之表資料仍依 R5 提交.
- 測試:T1、T2.

### R11 計時器相關之測試以事件同步(規格 R-TRACE-01 之本套件摘要)

- 規格(單一來源,內容不在此重述):`C:\opensrcOper\dspec\計時器相關函數之觀察回調與測試.md`(P1~P7);全域技能 role-coder-for-test 之計時器一節.
- 規則:
  1. 本套件自有計時器之行為提供 `opt.onTrace`(事件為凍結物件 `{type,...}`;取得回調一律 `getTrace(opt)`〔`import getTrace from 'wsemi/src/getTrace.mjs'`,不自寫等價實作〕;未傳時不組事件物件;回調拋錯/rejection 忽略;釋放後不再呼叫).事件全集見下表與兩端 JSDoc 的 `opt.onTrace`.
  2. 測試不以固定等待當肯定斷言之同步點:同步點為被測物公開事件(`waitEv`)、`onTrace` 事件(`tr.wait`)、測試監聽器被呼叫(`seen.wait`)或 promise;否定斷言(確認某事件不再發生)以排程次序柵欄 `fence()`(`test/tools/syncKit.mjs`,與被測物同為 wsemi `evEmitDelay` 1ms 計時器,先排先派)收尾,不以毫秒窗口.
  3. 「延遲多久」本身為規格者(合併窗口 200ms、`refreshTimeout`、`pollingDelayTime`、時序指紋 `syncdata`)以假時鐘 `useFakeClock`(`test/tools/timeKit.mjs`)驗證;防懸置上限一律用模組載入時保存之真實計時器(`traceRec` 的 guard、`within`).
  4. 公開事件由 `genEmit`(evEmitDelay)派發,`evEmitDelay` 不加 `onTrace`(主控 2026-10-29 裁定),測試改等被測物之公開事件或 `fence`.
  5. 伺服端合併窗口由 wsemi `debounce`(每 10ms 偵測、超過 200ms 未更新時執行最後一筆任務)擔任,取代 lodash-es `debounce`;`clearSync` 無條件呼叫其回傳函數之 `cancel()`(wsemi ≥1.9.33,2026-10-30 起):當下立即清除偵測計時器並丟棄未執行之任務,不留存活計時器.因此 `updateTableTagFlush` 與 `onTrace` 轉發不再以 `isCleared` 守門(flush 為同步函數,不跨釋放;唯一在釋放後仍會執行該次任務者為 `onTrace('flush')` 回調內呼叫 `clearSync`,該次任務之寫檔與推播由 `writeTableTags` 與 `genEmit` 之釋放檢查略過,S25).`queued` 事件須在 `updateTableTagCore(...)` 排入**之後**通知,否則回調內呼叫 `clearSync` 時 `cancel` 取消不到此次排入(S24).
  6. 假時鐘視窗不得漏清真實計時器(2026-10-29 tm-syncwebdata2,「測完不退出」之根因):`node:test` `mock.timers` 取代之全域 `clearTimeout`/`clearInterval` 只認假計時器,對視窗前建立之真實計時器為空操作.前一案以真實時鐘排入 wsemi `debounce`,其偵測計時器見佇列已空時自行 `clearInterval` 若落入下一案之假時鐘視窗(S1→S1b),該真實 `setInterval(10ms)` 漏清而永久存活,mocha 寫出報告後行程不結束.故假時鐘一律經 `useFakeClock`(`test/tools/timeKit.mjs`),其以登記表區分假、真實計時器並將真實者轉交原生 clear;不直接 `mock.timers.enable`.回歸:`test/unit-timeKit.test.mjs` K1~K3.
  7. 計時器洩漏必須在測試檔結束時失敗而非整個執行懸置,且 `clearSync` 後作用中之計時器須回到原值:各測試檔之 `describe` 以 `before` 的 `baselineTimers()` 記作用中計時器數、`after` 以 `settleTimers`(皆在 `test/tools/syncKit.mjs`,輪詢上限用真實計時器)等其回到基準——基準與等待須在同一狀態量測(皆已讓出一次 microtask):mocha 對 async 案/hook 於其回傳 promise 後才建立逾時計時器(未 unref,計入作用中計時器),同步段量測之數字不含它,直接比較會差 1 而於負載下偶發失敗(S23 曾 3/100);`clearSync` 之取消以同步量測斷言(`activeTimers()`,前後之間不讓出事件迴圈,不受負載影響):前端 K7(已排程之派發)、K7b(強制延遲計時器)、K7c(`refreshTimeout` 等待上限計時器),伺服端 S23(排入後未落檔)、S23b(已由 `writeTableTags` 落檔而合併佇列仍有任務,證明 `cancel` 為無條件呼叫)、S23d(從未排入、重複釋放),皆於 `clearSync` 當下以同步量測回到基準;S23c(窗口剛屆滿、偵測計時器待下次偵測才自停)與 S25(`onTrace('flush')` 回調內釋放)跨越等待或在偵測回呼內,改以釋放前後之差值斷言(S23c 差 2:偵測計時器+派發計時器;S25 差 1:正在執行回呼之偵測計時器),不用等待前取之基準——他處計時器(如前案洩漏者)於等待期間自行結束會抵銷而漏抓;S24(`onTrace('queued')` 回調內釋放)同步量測.
  8. 負載試驗須自動偵測「測完不退出」:`test/tools/loadTrial.mjs` 在 mocha 寫出報告後逾 `--hang-sec` 秒(預設 30,別名 `--exit-grace`)仍未結束者判失敗並樹殺,`--run-max`(預設 900 秒,0 為不限)為單次上限;加 `--diag` 時各行程每秒記錄仍撐住行程之資源及其建立堆疊(`test/tools/loadPreload.mjs` 之 `WSEMI_LT_DIAG`,測試可呼叫 `globalThis.__ltDiagDump(tag)` 另存快照),供定位.**這兩檔為 wsemi 統一版(wsemi ≥1.9.33 之 `test/tools/`),須同時整份複製、不各自修改**(環境變數 `WSEMI_LT_*` 為兩檔之間之約定);需擴充者回報 wsemi.本套件自行擴充之 `--diag`、`--hang-sec`、`--run-max`、`__ltDiagDump` 已於 2026-10-30 收回 wsemi 統一版.升版時以 `cmp node_modules/wsemi/test/tools/loadTrial.mjs test/tools/loadTrial.mjs`(與 `loadPreload.mjs`)確認位元組相同.
- 事件全集:

| 端 | type | 欄位 | 意義 |
|---|---|---|---|
| 伺服端 | `queued` | `tableName` | `updateTableTag` 已接受並排入合併佇列 |
| 伺服端 | `flush` | `dropped` | 合併窗口屆滿、即將寫檔並發出 `changeTableTags`;`dropped` 為被合併之較早更新數 |
| 前端 | `timeout` | `target:'table'`、`tableName`、`timeTag`、`ms`、`reported` | `refreshTimeout` 計時器到期;`reported` 為是否因此發 error |
| 前端 | `timeout` | `target:'tags'`、`ms` | `refreshTags` 等待上限到期 |
| 前端 | `delayStart` | `ms` | 輪詢強制延遲開始 |
| 前端 | `delayEnd` | `reason:'elapsed'|'cleared'` | 強制延遲結束;`cleared` 於 `clearSync` 呼叫期間同步發出 |

- 站點全集(`git grep -n --untracked "setTimeout\|setInterval\|debounce(" -- src`):伺服端 `debounce`(已套);前端 `refreshTable` 計時器、`pollingTableTags` 逾時計時器與強制延遲計時器(已套);`genEmit` 之 `evEmitDelay`(刻意不套,見規則 4).
- 測試:`test/unit-WSyncWebdataServer.test.mjs`(S1/S1b/S1c 及 S4~S22 事件同步、S16b、S23/S23b/S23c/S23d/S24/S25〔`clearSync` 取消 `debounce`,2026-10-30〕、`opt.onTrace` P3/P4 六案)、`test/unit-WSyncWebdataClient.test.mjs`(C 類案改事件同步、T1/T1b/T1c/T2b/T2c/D1/C16/P12/K7/K7b/K7c、`opt.onTrace` P3/P4 六案)、`test/syncdata.test.mjs`(假時鐘)、`test/unit-timeKit.test.mjs`(K1~K3,假時鐘工具之回歸);變異執行器與清單在工作目錄 `tmp/tm-syncwebdata/mutate.mjs`(單項與成對變異,結果與意義見 `sgud/state/state.md`).變異之成對項(P01~P04)用以以實驗證明「單獨存活者為兩道防線重疊之等價」:單獨移除任一道皆存活,成對移除即被既有案擊殺.
- 負載基準(改造前,2026-10-29 06:13–06:27,`--lock-exclusive`,摘要 `tmp/quiet-run/20261029-060341-tm-syncwebdata-load-before.log`):CPU 壓力 8 行程 ×10:`syncdata` 3/10 失敗;事件迴圈阻塞 400:1000 ×10:`syncdata` 10/10、S4 7/10 失敗;重度阻塞 1500:3000 ×8:0 失敗.

## 2. 已知限制(刻意,已寫入 JSDoc)

- 預設 refreshTimeout=0 時,監聽器永不回覆之表要等到同表下一次請求才結束舊批次之等待.真實觸發點為 w-serv-webdata 前端之提前 return(已轉告).
- 監聽器須為同步函數;async 監聽器之 rejection 不在攔截範圍.
- 同一事件之前一監聽器同步拋錯時,後續監聽器不被呼叫(eventemitter3 語意).
- getData 監聽器拋錯時,該表時間戳已推進,不會因此重拉.
- 被取代之批次,其 afterUpdateTableTags 可能早於該表資料送達.
- 釋放前已提交之時間戳,其 getData 若尚未派發則不再派發.
- 前端 setTableTags 之物件直接作為內部狀態(之後就地修改);伺服端 getTableTags 回傳內部狀態、`useInputOnly` 保存傳入之參照.
- 伺服端 debounce 無上限:持續有更新且間隔皆小於 200ms 時,推播延至更新停止後.合併窗口改由 wsemi `debounce` 擔任(2026-10-29):每 10ms 偵測,實際於最後一次更新後 200~210ms 內觸發(原 lodash 為恰 200ms);`clearSync` 呼叫 wsemi `debounce` 之 `cancel()`(wsemi ≥1.9.33,2026-10-30 起)立即停止偵測計時器並丟棄未執行之任務.
- 表名不得為 `__proto__`;同一事件物件只能建立一個同步器,重建前須先 clearSync;上層掛於 ORM 之監聽由上層移除.

## 3. 可見行為變更紀錄

### 2026-10-13(1.1.6 之後)

- 新增:前後端 `clearSync()`;前端 `opt.refreshTimeout`;各表失敗之 error 新增 `tableName`、`timeTag` 欄位.
- 變更:updateTableTags、pollingTableTags 恆不 reject;監聽器拋錯轉為 error 事件(不再 uncaughtException);無 error 監聽者時改為 console.error;非物件之時間戳輸入改發 error(原為把字元或索引當表名);同一時刻多則推播之同表請求只派發最新者(refreshTable 事件變少);同表較舊之晚到回應不再覆蓋較新者;伺服端不可序列化時不再截空檔案;伺服端寫入入口檢核輸入.
- 新增錯誤訊息:`no listener for event[refreshTable|refreshTags]`、`listener of event[X] error`、`invalid tableTags`、`invalid tableTags for setTableTags|initTableTags`、`invalid tableName`、`can not save table data: X`、`can not serialize tableTags: …`、`updateTableTags catch`、`pollingTableTags catch`、逾時訊息.

### 2026-10-29(計時器觀察回調輪,tm-syncwebdata)

- 新增:前後端 `opt.onTrace`(事件見 R11);相依 `wsemi` 升至 ^1.9.29.
- 變更(非破壞性):伺服端合併窗口由 lodash-es `debounce`(恰 200ms)改為 wsemi `debounce`(每 10ms 偵測,實際 200~210ms),推播最多晚 10ms;`clearSync` 不再取消計時器而於屆滿時略過,其偵測計時器至多再存活約 210ms.未傳 `onTrace` 時其餘對外行為不變.

### 2026-10-30(wsemi 1.9.33 接入輪,a-syncweb)

- 變更(非破壞性,對外 API 與事件不變):伺服端 `clearSync` 改呼叫 wsemi `debounce` 之 `cancel()`,偵測計時器於呼叫當下立即清除(原至多再存活約 210ms 才自停);釋放後已排入之任務不再屆滿執行(原由 `isCleared` 略過).`onTrace` 之 `queued` 事件改於排入合併佇列之後通知(原在其前;僅影響回調內呼叫 `clearSync` 之情形:原會使偵測計時器於釋放後重新啟動並存活至屆滿).相依 `wsemi` 升至 ^1.9.33.
- 測試:負載執行器 `test/tools/loadTrial.mjs`、`loadPreload.mjs` 改為 wsemi 統一版整份複製(R11 規則 8).

## 4. 測試與驗收對應

- `test/unit-WSyncWebdataClient.test.mjs`(38 條)、`test/unit-WSyncWebdataServer.test.mjs`(15 條)、既有 `test/syncdata.test.mjs`(時序指紋,正常路徑之回歸基準);`npm test` 2026-10-13 為 54/54.
- 鑑別力:同一批新測試指向修正前之 src,只有維持現行行為之格(B1、C1、C12、B4、P2、S1/S2、S6–S9)通過,其餘皆紅.
- 下游整合:見 `sgud/exp/experience.md` E12(以解析掛鉤跑 w-serv-hapi 之 api-exec 等四支,2026-10-13 原版與修正版皆 41 passing、1 pending).
- 瀏覽器:見 `sgud/exp/experience.md` E13.
