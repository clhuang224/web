# 建置、載入與部署

開發 Lynn’s 時，不只有一個把 `.vue` 變成網頁的步驟。Lynx 應用程式、瀏覽器外殼和樣式輸出需要一起配合。

## 先看三份輸入

1. `src/index.ts`：VueLynx 應用程式入口。
2. `src/host/index.ts`：瀏覽器外殼入口。
3. `src/**/*.vue` 中的 utility class：UnoCSS 的掃描內容。

設定與腳本的連結在[原始碼地圖](source-map.md)。了解入口後，再看打包工具會比較容易分辨各自的責任。

## 主站 build 按什麼順序執行？

目前 `pnpm run build` 依序：

```text
UnoCSS 產生樣式
    → Rspeedy 建置 Lynx 與 Web 輸出到 dist/lynx
    → Rsbuild 建置瀏覽器外殼到 dist
    → verify-build.mjs 檢查必要輸出
```

瀏覽器外殼建置設定保留前一步輸出，並複製 `site-host.mjs` 成為 bridge 檔案。只部署一個 JS 檔案不夠，因為 HTML、bundle、worker、WASM、bridge 和圖片都可能是載入的一部分。

工具版本也有相容關係。目前專案保留特定的 VueLynx、Rspeedy、Rsbuild 和 Web Core 組合；升級時要一起重驗，而不是把某一個套件的最新版本直接視為相容。

## 開發時兩個服務怎麼接？

主站的 `pnpm run dev` 先產生樣式，再啟動樣式 watch、Rspeedy 和瀏覽器 host。host 使用 `3000`，Rspeedy 使用 `3001`；host 把 `/lynx` 請求代理到 Rspeedy。

因此「開發伺服器已啟動」有好幾層意思：程序存在、檔案可請求、runtime 可載入、應用程式就緒。前兩者成功不保證後兩者。

本地靜態預覽使用主站的 `pnpm run preview`，服務 `dist/`，預設埠為 `4173`。這驗證的是靜態輸出路徑，與開發代理是不同情境。

## 載入前後由誰負責畫面？

HTML 先提供載入提示與網誌入口。瀏覽器 host 建立 `lynx-view`，設定 bridge 和 bundle URL，等待應用程式的 `getState` 握手。

握手後才標成就緒；載入錯誤或逾時則顯示 fallback。這讓 Lynx 尚未完成載入時，訪客仍有可以理解的狀態。

載入失敗時，可依序查 HTML、bundle、bridge、圖片與 runtime 資產的請求，再看握手是否抵達。直接把所有錯誤歸為元件問題，容易漏掉外殼與路徑的原因。

## 靜態主機需要提供什麼？

目前預覽實作提供 root-relative 路徑、WASM MIME、深層頁面處理，以及 `Cross-Origin-Opener-Policy`、`Cross-Origin-Embedder-Policy` headers。正式主機要逐項驗證這些需求，不能只因為能託管 HTML 就視為完成部署。

深層路徑還有兩種錯誤：不知道這種頁面，和知道頁面種類卻找不到 ID。主站預覽的路徑匹配主要看形狀，host 再看有效 ID，所以 HTTP 狀態和畫面訊息需要分開檢查。

## 文件網站要在哪一層整合？

幕後文件預計使用 `/guide/` 前綴並獨立建置，再把靜態輸出放到主站發佈目錄的 `guide/` 下。文件路徑必須先找到自己的檔案，不能被主站 SPA fallback 接走。

主站的側欄入口也應做完整文件導航；文件提供回到主站的連結。原生端則可以由既有 App 內網頁視窗開啟文件的正式 HTTPS 網址。

這是文件的整合方向，仍需要實作與部署驗證。主站目前的 build 並未因為寫了這份指南就自動包含文件。

## 這一層有什麼學習價值？

可以清楚分辨原始碼、建置輸出與執行時能力。遇到問題時，先確認自己正在驗證哪一層，再選檢查方法；「build 成功」只是其中一個證據。
