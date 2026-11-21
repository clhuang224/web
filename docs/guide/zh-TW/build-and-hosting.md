# 建置、載入與部署

執行 `pnpm run build` 之後，專案會產生可以發佈的檔案。不過這個網站有 Lynx 應用程式、瀏覽器外殼與幕後文件，因此需要先認識各自的入口和輸出。

## 原始碼從哪裡進入？

`src/index.ts` 是 VueLynx 的入口，負責建立應用程式。`src/host/index.ts` 則在瀏覽器執行，建立承接應用程式的 `lynx-view`。

幕後文件放在 `docs/guide/zh-TW/`，由 VitePress 建置。它使用一般瀏覽器 Vue 與 HTML，所以有自己的設定，不會把文章直接當成 Lynx 元件編譯。

設定與腳本的完整連結在[原始碼地圖](source-map.md)。

## build 的執行順序

目前 `pnpm run build` 依序執行：

```text
UnoCSS 產生樣式
    → Rspeedy 建置 Lynx 與 Web 輸出到 dist/lynx
    → Rsbuild 建置瀏覽器外殼到 dist
    → VitePress 建置幕後文件到 dist/guide
    → verify-build.mjs 檢查必要輸出
```

首先產生 utility CSS，再建置需要使用它的應用程式。瀏覽器外殼與文件的建置會保留前面的輸出，避免後一個步驟把前一個步驟的檔案清掉。

最後的輸出檢查確認必要檔案存在，包含主站 HTML、Lynx bundle、bridge 和文件首頁。它可以找出漏掉產物的問題，但實際載入仍要由預覽與部署環境確認。

## 開發服務如何配合？

`pnpm run dev` 會先產生樣式，再啟動樣式 watch、Rspeedy、VitePress 與瀏覽器 host。

| 服務        | 預設位置                | 提供的內容                      |
| ----------- | ----------------------- | ------------------------------- |
| 瀏覽器 host | `localhost:3000`        | 主站 HTML、平台能力與開發代理。 |
| Rspeedy     | `localhost:3001`        | Lynx 應用程式資源。             |
| VitePress   | `localhost:3002/guide/` | 幕後文件。                      |

瀏覽器平常連到 `3000`。host 會把 `/lynx` 代理到 Rspeedy，把 `/guide` 代理到 VitePress，因此站內顯示文件時仍然使用相同來源。

這也表示，看到其中一個服務啟動，還需要確認其他服務與代理正常。可以依序檢查 HTML、bundle、bridge 和文件的請求，縮小問題範圍。

## 從載入到應用程式就緒

HTML 先提供載入提示與網誌入口。接著瀏覽器 host 建立 `lynx-view`，設定 bridge 和 bundle URL，等待應用程式呼叫 `getState`。

這個呼叫也作為就緒訊號。host 收到後會解除載入逾時，並傳回目前狀態；載入錯誤或逾時則顯示 fallback。相關資料流可以接著看[平台轉接](runtime-bridge.md)。

## 文件如何留在網站裡？

側欄進入的是 `/behind-the-scenes`，章節使用 `/behind-the-scenes/<章節>`。主站保留側欄，GuidePage 負責放置文件內容。

Web 端由 host 在容器中加入 iframe，載入 `/guide/` 下的 VitePress 頁面。原生端則使用 webview。文件在嵌入模式會隱藏重複的導覽，章節順序與標題共用 `src/content/guide.ts`。

因此部署時有兩組路徑需要處理：站內的閱讀位置，以及文件本身的靜態 HTML 和資產。`scripts/preview.mjs` 會先解析 `/guide/` 頁面、目錄首頁及 `.html` 檔案，未知文件路徑使用文件自己的 404 頁。

## GitHub Pages 多做了什麼？

Pages workflow 執行 `pnpm run build:pages`。這個命令先完成上面的建置，再執行 `scripts/prepare-pages.mjs`。

這支腳本從頁面與語言清單產生各路徑的 `index.html`，並加入主站的 `404.html` 和 `CNAME`。如此一來，直接打開作品或幕後章節的網址時，靜態主機也有對應的入口。

這些主站頁面副本使用相同的 host HTML；它們還不是各作品完整內容的預渲染頁。程式仍然要從網址讀取頁面身分，再載入應用程式。文件則由 VitePress 產生各篇的靜態內容。

本地預覽使用 `pnpm run preview`，預設位置為 `localhost:4173`。它會提供 MIME、路徑解析與隔離 headers；GitHub Pages 的實際回應可能不同，因此深層網址、WASM、worker、字體和圖片都需要在發佈環境確認。

## 如何判讀檢查結果？

建置通過，表示程式能產生輸出；預覽成功，表示這些輸出能在該預覽設定下使用；部署後的檢查，才會接觸正式網址與主機行為。

先分清楚正在看哪一層，遇到載入問題時，就比較容易找到合適的檢查入口。
