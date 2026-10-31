# 現況(狀態)

本檔記當前已開發功能之最新狀態:做到哪裡、對應之規則帳本條目與測試檔、已知缺口與待辦、最近一次驗證或發布之版本.只記現況、不寫過程(過程寫入 `sgud/exp/experience.md`).

更新日期:2026-10-31(syncweb 診斷輸出輪結束時).

## 功能與規則對應

| 功能 | 狀態 | 規則帳本 | 測試檔 |
|---|---|---|---|
| 前端批次、帶 pm 事件、同表提交規則、公開寫入入口、釋放、輪詢、等待上限 | 完成(2026-10-13) | R1~R10 | `test/unit-WSyncWebdataClient.test.mjs` |
| 伺服端落檔、合併推播、釋放 | 完成(2026-10-13);合併窗口改 wsemi `debounce`(2026-10-29);`clearSync` 改呼叫其 `cancel()` 立即清除偵測計時器(wsemi ≥1.9.33,2026-10-30) | R3、R6~R8 | `test/unit-WSyncWebdataServer.test.mjs` |
| 計時器相關之觀察回調 `opt.onTrace`(前後端) | 完成(2026-10-29) | R11 | 同上兩檔之 `opt.onTrace` 段 |
| 事件同步化之測試(C 類 37 案 + 時序指紋 `syncdata`) | 完成;負載試驗三段(改造前後對照)與變異驗證皆已實跑(2026-10-29) | R11 | 三個測試檔 |
| 假時鐘工具 `useFakeClock` 對真實計時器之清除轉交原生 clear(「測完不退出」之根因修正) | 完成(2026-10-29) | R11 規則 6 | `test/unit-timeKit.test.mjs`(K1~K3) |
| `clearSync` 後計時器回到原值之斷言、測試檔結束時之計時器洩漏檢查 | 完成(2026-10-29);伺服端改為 `clearSync` 當下同步量測並補重入情形(2026-10-30) | R11 規則 5、7 | 前端 K7/K7b/K7c、伺服端 S23/S23b/S23c/S23d/S24/S25、各 `describe` 之 `before/after` |
| 診斷輸出(排程第 158 項):無 error 監聽者時預設只出固定標籤與安全摘要,`opt.logDetail`／`opt.funLog` 取細節;建構期提示亦經同一出口;`src` 不直接呼叫 `console` | 完成(2026-10-31);wsemi 端殘餘站點(`evEmit`、`debounce`)未修,已寫建議書交主控 | R12、R4 | `test/unit-diag.test.mjs`(49 案)、`L4`、`S22` |
| 負載試驗工具自動偵測「測完不退出」並可記錄存活資源之建立堆疊 | 完成;2026-10-30 起為 wsemi 統一版整份複製(不各自修改,擴充回報 wsemi) | R11 規則 8 | `test/tools/loadTrial.mjs`(`--hang-sec`、`--run-max`、`--diag`)、`test/tools/loadPreload.mjs`(`WSEMI_LT_*`、`__ltDiagDump`) |

## 本輪(syncweb,第 158 項)結論

- **屬實**:原 `genEmit.deliver` 無 error 監聽者時 `console.error('[w-sync-webdata]', 整個事件內容)`,含 `err`(使用端拒絕值、拋出值、fs 錯誤含路徑)、`tableName`、`timeTag`、被拒收之輸入值;14 個站點觸發案修前 13 個預設輸出含哨兵.已改經 wsemi `getDiag`(R12);站點全表見規則帳本 R12.
- **未修(wsemi 端)**:`evEmit.mjs:96/101`(監聽器拋錯且無 error 監聽者、error 監聽器自身拋錯)、`debounce.mjs:184/202`,依提示詞不在本輪、不繞道;建議書 `agent-out/syncweb-建議wsemi修正.md`;README 與帳本 §2 註明殘餘.
- **對外行為變更(破壞性)**:預設輸出改為固定標籤+安全摘要(README〈Breaking changes〉、帳本 §3);新增前後端 `opt.logDetail`、`opt.funLog`.
- 測試:`npm test` 136 案(原 87 + `unit-diag` 49)、連跑 5 次全綠;eslint 0 error;變異 13 項(M01~M13)全擊殺、對照 M00 全綠(執行器與結果留存於主控任務夾 `dnow/20261031101856/agent-out/syncweb-evidence/mutate.mjs`、`mutate-result.json`;repo 內 `./tmp/syncweb/` 已清理,重跑時複製至 `./tmp/syncweb/` 並於套件根以 quiet-run --lock 執行,報告 `agent-out/syncweb-修正報告.md`).

## 前一輪(tm-syncwebdata2)結論

- **「測完不退出」**:根因為測試缺陷——`useFakeClock` 啟用 `mock.timers` 後,其 `clearInterval`/`clearTimeout` 對視窗前建立之真實計時器為空操作;S1 案以真實時鐘排入 wsemi `debounce`,偵測計時器停止時之 `clearInterval` 若落入下一案 S1b 之假時鐘視窗即漏清,該 `setInterval(10ms)` 永久存活.修正前:事件迴圈阻塞 400:1000 為 6/30 不退出、無負載 1/10 不退出;修正後 0/40(見報告).產品(src)無缺陷,未動.
- **變異**:41 項(含 M00 對照)新舊對照見報告;無「舊殺新活」;C17、C19、C11 已被新案擊殺;C20、S03、G01 單獨存活,以成對變異 P01~P04 之實驗證明為兩道防線重疊之等價.
- **負載試驗**:改造後三段(CPU 壓力 10、阻塞 400:1000 10、重度阻塞 1500:3000 8)皆每次自行退出,見報告對照表.
- 測試檔數與案數:`npm test` 136 案(2026-10-31:五個測試檔,新增 `unit-diag` 49 案;2026-10-30 為 87 案,伺服端 S23b/S23c/S23d/S24/S25 為當時新增;2026-10-29 為 82 案).

## 已知缺口

- 預設 `refreshTimeout=0` 等已知限制見規則帳本 §2.
- `test/unit-WSyncWebdataClient.test.mjs` 之 C12(同 tag 持續重送,真實時間間隔)保留 `sleep`(A 類,規格即真實時間間隔),其「重送期間 getData 已送達」斷言對負載仍敏感,本輪負載試驗未見失敗.
- 伺服端 S10/S18、S21、S11~S14、S16 與前端 C2(第二案)以外之否定窗仍用 `sleep`(A 類).
- 無(伺服端 `debounce` 無 `cancel` 之缺口已於 2026-10-30 隨 wsemi 1.9.33 解除,見 R11 規則 5).

- 監聽器(如 `getData`)拋錯且未掛 error 監聽者、或 error 監聽器自身拋錯時,拋出值仍由 wsemi `evEmit` 原樣寫 `console.error`(R12 站點 5,待 wsemi 修正);`pollingTableTags catch` 站點(`eeEmit('error'` 之 `pollingTableTags catch`)無公開入口可觸發,僅由站點同經 `deliver` 與靜態盤點覆蓋.
- w-serv-webdata(唯一直接依賴者)建立本套件時未傳 `opt`,其 `logDetail`/`funLog` 未轉送(見 E23 下游).

## 最近一次驗證/發布

- 發布:無(`package.json` 版本 1.1.11,本輪不改 version;`wsemi` 相依 ^1.9.33,已為最新).
- 驗證(2026-10-31 本輪):`npm test` 136 passing ×5(quiet-run --lock)、eslint 0 error、變異 13/13;細節見上方〈本輪(syncweb,第 158 項)結論〉.以下為前一輪:
- 驗證:2026-10-30 本輪 `npm test` 87 passing(含 `unit-timeKit` 3 案;伺服端新增 S23b/S23c/S23d/S24/S25 共 5 案)、eslint 0 error;變異 M01~M06 與負載執行器實跑見報告 `agent-out/a-syncweb-修正報告.md`;2026-10-29 之負載與變異結果見報告 `agent-out/tm-syncwebdata2-修正報告.md`.
