# 現況(狀態)

本檔記當前已開發功能之最新狀態:做到哪裡、對應之規則帳本條目與測試檔、已知缺口與待辦、最近一次驗證或發布之版本.只記現況、不寫過程(過程寫入 `sgud/exp/experience.md`).

更新日期:2026-10-29(tm-syncwebdata2 輪結束時).

## 功能與規則對應

| 功能 | 狀態 | 規則帳本 | 測試檔 |
|---|---|---|---|
| 前端批次、帶 pm 事件、同表提交規則、公開寫入入口、釋放、輪詢、等待上限 | 完成(2026-10-13) | R1~R10 | `test/unit-WSyncWebdataClient.test.mjs` |
| 伺服端落檔、合併推播、釋放 | 完成(2026-10-13);合併窗口改 wsemi `debounce`(2026-10-29) | R3、R6~R8 | `test/unit-WSyncWebdataServer.test.mjs` |
| 計時器相關之觀察回調 `opt.onTrace`(前後端) | 完成(2026-10-29) | R11 | 同上兩檔之 `opt.onTrace` 段 |
| 事件同步化之測試(C 類 37 案 + 時序指紋 `syncdata`) | 完成;負載試驗三段(改造前後對照)與變異驗證皆已實跑(2026-10-29) | R11 | 三個測試檔 |
| 假時鐘工具 `useFakeClock` 對真實計時器之清除轉交原生 clear(「測完不退出」之根因修正) | 完成(2026-10-29) | R11 規則 6 | `test/unit-timeKit.test.mjs`(K1~K3) |
| `clearSync` 後計時器回到原值之斷言、測試檔結束時之計時器洩漏檢查 | 完成(2026-10-29) | R11 規則 7 | 前端 K7/K7b/K7c、伺服端 S23、各 `describe` 之 `before/after` |
| 負載試驗工具自動偵測「測完不退出」並可記錄存活資源之建立堆疊 | 完成(2026-10-29) | R11 規則 8 | `test/tools/loadTrial.mjs`(`--hang-sec`、`--diag`)、`test/tools/loadPreload.mjs` |

## 本輪(tm-syncwebdata2)結論

- **「測完不退出」**:根因為測試缺陷——`useFakeClock` 啟用 `mock.timers` 後,其 `clearInterval`/`clearTimeout` 對視窗前建立之真實計時器為空操作;S1 案以真實時鐘排入 wsemi `debounce`,偵測計時器停止時之 `clearInterval` 若落入下一案 S1b 之假時鐘視窗即漏清,該 `setInterval(10ms)` 永久存活.修正前:事件迴圈阻塞 400:1000 為 6/30 不退出、無負載 1/10 不退出;修正後 0/40(見報告).產品(src)無缺陷,未動.
- **變異**:41 項(含 M00 對照)新舊對照見報告;無「舊殺新活」;C17、C19、C11 已被新案擊殺;C20、S03、G01 單獨存活,以成對變異 P01~P04 之實驗證明為兩道防線重疊之等價.
- **負載試驗**:改造後三段(CPU 壓力 10、阻塞 400:1000 10、重度阻塞 1500:3000 8)皆每次自行退出,見報告對照表.
- 測試檔數與案數:`npm test` 82 案(三個既有檔 79 + `unit-timeKit` 3).

## 已知缺口

- 預設 `refreshTimeout=0` 等已知限制見規則帳本 §2.
- `test/unit-WSyncWebdataClient.test.mjs` 之 C12(同 tag 持續重送,真實時間間隔)保留 `sleep`(A 類,規格即真實時間間隔),其「重送期間 getData 已送達」斷言對負載仍敏感,本輪負載試驗未見失敗.
- 伺服端 S10/S18、S21、S11~S14、S16 與前端 C2(第二案)以外之否定窗仍用 `sleep`(A 類).
- 伺服端 wsemi `debounce` 無 `cancel`,`clearSync` 後偵測計時器至多再存活約 210ms 才自停(S23 以輪詢等其自停);如需 `clearSync` 當下即取消,須由 wsemi 增補 `cancel`(已於前一輪報告列入待裁示).

## 最近一次驗證/發布

- 發布:無(版本 1.1.9,本輪不改 version).
- 驗證:2026-10-29 本輪 `npm test` 82 passing(含 `unit-timeKit` 3 案)、eslint 0 error;負載與變異結果見報告 `agent-out/tm-syncwebdata2-修正報告.md`.
