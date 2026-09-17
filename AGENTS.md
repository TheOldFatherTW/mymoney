# MyMoney — 代理工作指引

本庫是 **Fami 可共用門面（shareable door）** 之一。同族門面：famibook、kodohon、gamepal、mymoney；改共用殼時要一併想到它們。

## 架構

```
GitHub Pages（公開門面） → config.js VAULT_ORIGIN → 家裡保險庫（本機 HTTP ~8770 + Cloudflare 隧道） → 嘉信退休金看板資料
```

- **公開門面**：`index.html`、`hey.html` 與靜態資源，部署在 GitHub Pages。
- **家裡保險庫**：持倉與報價在家裡（`npm start`，埠 **8770**），經隧道連上；隧道網址寫進 `config.js` 的 `window.VAULT_ORIGIN`。
- **鑰匙**：個人檢視鑰匙不進 git；由 URL、`localStorage`（`mymoney.viewKey`）、cookie 等傳遞（見 `gate.js`）。

使用者入口一律是 **GitHub Pages 網址**（桌機／iPad／iPhone 同一顆），不是 exe 或 bat。

## 產品

**MyMoney** — 嘉信（Schwab）退休金看板：總額、可提領、持倉、複利估算與最近消息。產品 PIN 流程（數字門）保留；語意是「給家人看的退休金」，與 YRoom 私密觀看 **分開**。

## 畫面殼與詞彙表

門面 UI 必須對齊 skill **`fami-shared-ui`** 詞彙表，不得自造第三種卡片或按鈕型態。

| 詞彙 | 意義 |
|------|------|
| 返回 | 共用返回元件 |
| 確認 | 共用確認元件 |
| 找卡／操作卡 | 共用操作卡片 |
| 齒輪 | 設定選單 |
| 愛心 | 多選／最愛工具列 |
| 首頁頭 | 連上後的個人頁頂部 |
| 入口色塊（`.blobs`） | 未連線時的入口頁 |
| 等待 | 三種語言的等待 UI |

活標本：`D:\Mybook\web`、`E:\FamilyPhotos\web`（本機開發時參照）。

預設交付 **標準版個人頁**（有封面縮圖、長押多選、齒輪圖示、首頁頭等）。禁止未經使用者同意做閹割版。

## 共用政策（核心）

**能共用的物件 100% 共用。**

- 返回、確認、找卡／操作卡、齒輪、等待、入口頁／個人頁骨架等 **門面殼** 必須與同族門面一致。
- 改一顆共用件 = 同一回合改所有掛上的門面（famibook、kodohon、gamepal、mymoney 等），並提高 `?v=`。
- **禁止** 各專案自做「第三種卡」或私製按鈕；對不到的才評估「有必要」並先問使用者。
- 要改樣式須定義新名字（例如返回2、確認2）並寫進 `fami-shared-ui` 詞彙表，不得偷偷改原件。

產品內容（書櫃／相簿／遊戲／退休金看板）可以不同；**門面殼不能各做各的**。

## FamiGate 核心

- 鑑權與連線邏輯集中在 **`gate.js`（FamiGate 核心）**；設定由 `config.js` 的 `FAMIGATE_CONFIG` 驅動。
- **優先共用同一顆 FamiGate 核心**；不要無必要地 fork `gate.js`。
- 各 app 保留自己的 `viewKeyStorage` 前綴（本庫：`mymoney.viewKey`）；不可跨 app 混用。
- `origin()` 在 localhost 與 `VAULT_ORIGIN` 為空時 fallback 到 `location.origin`（與 gamepal 同形）。

## 本庫主要檔案（代理須知）

| 檔案 | 角色 |
|------|------|
| `config.js` | `VAULT_ORIGIN`、`FAMIGATE_CONFIG` — 隧道起點（可 commit，不含鑰匙） |
| `gate.js` | FamiGate：鑰匙、API、鍵盤／viewport |
| `door.js` | 退休金看板／個人頁產品邏輯 |
| `hey.js` | 入口／邀請與 PIN 門 |
| `app.css` / `money.css` | 門面樣式與產品皮 |
| `hey.html` | 入口／邀請頁 |
| `index.html` | 個人頁／看板 |

**Wave1 及政策類工作**：只改 `AGENTS.md`、`.cursor/rules/` 等文件與規則時，**不要**動 `gate.js`、`hey.html`、`door.js`、`app.css` 或執行期設定行為，除非使用者明確要求功能變更。

## Git 與部署

- 會出現在 GitHub Pages 的門面檔：驗證後 commit 並 push；提高 `?v=` 快取破壞參數。
- 不要推金鑰、照片、PDF、保險庫內部資料。
- 本庫為 MyMoney 產品；與 famibook、kodohon、gamepal 共用門面政策，各自 `VAULT_ORIGIN` 與產品邏輯。

## 開工前必讀

1. 本檔 `AGENTS.md`
2. Cursor 規則：`.cursor/rules/fami-shared.mdc`
3. Skill：`fami-shared-ui`（詞彙表、bootstrap、標準版個人頁）
4. 需要三端（iPhone／iPad／桌機）同一門面時：`ios-home-web`

## YRoom 除外

YRoom 是 **私密觀看、硬隔離** 產品，不適用本庫的 FamiGate 共用模組或 storage 前綴共用。僅 UI 詞彙可對齊；auth／origin／storage 必須與其他 Fami 應用隔離。詳見 yroom 專庫的 AGENTS 與規則。**勿讓 MyMoney 誤連或讀取 YRoom 內容。**
