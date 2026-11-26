# 回饋

本檔記任務中發現之自有套件、全域技能、全域設定之調整與抽提提案(一條一列,只增不改;處置結果另記一列並寫明承接哪一列).回饋是紀錄與提案,實際修改依主控之通報管道.

| 日期 | 類別 | 對象 | 內容 | 依據 |
|---|---|---|---|---|
| 2026-11-26 | 自有套件 | wsemi `o2j`(及同批改為固定詞彙之函數)之 JSDoc | 回傳之 `msg` 改為固定詞彙後,下游要保留原因只能自寫 `funLog` 閉包取回並接為 `Error.cause`;建議於 JSDoc 補此用法範例,並註明三點:`funLog` 與 `logDetail` 並給時 `funLog` 優先(只給 `funLog` 即不寫 console)、`detail` 為 `getDiag` 遮罩後之副本(非原物件,同類別、`message` 保留)、輸入為 `undefined` 之早退不呼叫 `funLog`(故以「有無被呼叫」之旗標判斷,不以 `detail` 是否為 `null`) | `node_modules/wsemi/src/o2j.mjs:15-17,57-59,73`;`src/WSyncWebdataServer.mjs` `writeTableTagsCore`;`sgud/exp/experience.md` E24 |
| 2026-11-26 | 全域技能 | role-coder-for-test §10(變異驗證) | 建議補一句:以變異驗「預設輸出不含 X」之測試時,先確認該變異會進入預設輸出之路徑;被上游防線(如 wsemi `getDiag.brief` 只取 `errType`／`errCode`)擋住之變異(例:原因拼進 `Error.message`)必存活於預設案,其鑑別力須由有監聽者之案(斷言 `err.message`)承擔,預設案則以能進入標籤或安全摘要之變異(例:拼進事件 `msg`,其冒號前即標籤)驗證;派工書若指定某變異證明預設案,宜先以實測確認其會被擊殺 | `sgud/exp/experience.md` E24 陷阱 (1);變異 M02(預設案存活)、M03(G-S3 擊殺) |
