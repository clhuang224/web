# 原生端探索

前面的章節大多可以從熟悉的 Vue 資料流理解。到了 Android，元件和規則仍然可以共用，但圖檔、網址與平台 API 的差異會更明顯。這篇整理目前的接法，再說明可以如何驗證。

目前專案已記錄在 Android 的 Lynx Explorer 4.2 載入原生 bundle，並加入 SVG 和外部網頁的處理。這是 Explorer 內的執行路徑，尚不是一個獨立發佈的 App。

## Explorer 和網站之間有什麼差別？

[Lynx Explorer](https://lynxjs.org/guide/start/quick-start.html) 是官方提供的開發預覽途徑。它用來載入 Lynx 頁面；產品發佈還需要選擇實際的 host 或 App 整合方式。

在 Web，瀏覽器外殼提供網址、History、儲存和視窗能力。Explorer 裡沒有本專案的瀏覽器 host，所以程式需要 standalone 路徑。

| 能力         | Web 路徑                    | 目前 standalone 路徑             |
| ------------ | --------------------------- | -------------------------------- |
| 頁面切換     | host 更新網址，再同步狀態。 | 直接更新應用程式的頁面狀態。     |
| 語言選擇     | 公開網址與瀏覽器偏好。      | 應用程式記憶體中的語言狀態。     |
| 版面寬度     | media query 監看。          | 從 SystemInfo 計算初始寬度。     |
| 減少動態效果 | 瀏覽器媒體偏好。            | 初始為 false，尚無同等偏好同步。 |
| 圖片路徑     | 網站根路徑。                | bundle 的資源前綴。              |
| SVG          | image 元素路徑。            | VectorImage 選用原生 svg。       |
| 外部網站     | 瀏覽器開新視窗。            | App 內 webview，提供關閉操作。   |

表格描述程式分支。旋轉螢幕、系統返回、輔助工具與生命週期等體驗，仍需逐項驗證。

## 一個很小的判斷，也可能是平台差異

`runtime.ts` 使用 `SystemInfo.platform` 判斷環境，而不是只看自訂 SiteHost 是否存在。專案記錄的 Explorer 情境中，模組也可能以 `null` 呈現；只用一種缺值形狀判斷會漏掉差異。

同樣地，GitHub 網址解析目前採用受限的字串規則。專案記錄的原生 `URL` 實作沒有預期的 `hostname` 與 `pathname`，因此來源解析改成針對既定 GitHub 格式的字串檢查。這反映了一個維護原則：確認 runtime 真正提供的 API，不只看相同名稱是否存在。

另一個已確認的差異是 SVG 顯示：原本使用 image 載入 SVG，在原生端無法顯示；`VectorImage` 因此在 Web 使用 image、在原生端改用 svg。這裡的處理保留同一個來源檔案，把元素差異集中在包裝元件。

## 為什麼外連使用 App 內網頁視窗？

Explorer 收到要載入的位置時，預期的是 Lynx bundle。一般網站網址不是同一種資源，因此應用程式把外連交給 `InAppBrowser`，用 `<webview>` 顯示網頁，並提供關閉按鈕。

這解決了目前情境中的入口問題，後續還要檢查：回到作品頁是否保留狀態、登入與外部跳轉怎麼處理、系統返回與焦點是否合理，以及不同 shell 的 webview 支援。

## Android 開發路徑怎麼讀？

專案架構文件列出的本地連接方式是先建立 USB 反向連接，再讓開發 bundle 使用可抵達的 host：

```sh
adb reverse tcp:3001 tcp:3001
LYNX_DEV_HOST=127.0.0.1 pnpm run dev
```

這需要已安裝 Android 平台工具、已授權的裝置和合適的 Explorer 版本。`adb reverse` 的用途，是讓裝置對該埠的連線轉回開發電腦；它不會自動配置正式部署。

實際 bundle URL 應以 Rspeedy 當次輸出為準。這裡的連線設定供本地開發使用，正式建置則另外指定可公開存取的位置。

## 全螢幕模式與安全區

在 Explorer 載入 Lynx bundle 的 URL 加上 `?fullscreen=true`，可以隱藏 Explorer 的導航列。畫面延伸到整個視窗後，也需要為狀態列與底部操作區保留空間。

`safeAreaInsets()` 從 Explorer 提供的 global props 讀取這些數值：

```ts
export function safeAreaInsets() {
  const props = typeof lynx === 'undefined' ? undefined : lynx?.__globalProps
  if (!isStandalone() || typeof props !== 'object' || props === null)
    return { top: 0, bottom: 0 }
  const fullscreen = Reflect.get(props, 'fullscreen')
  if (fullscreen !== true && fullscreen !== 'true') return { top: 0, bottom: 0 }
  return {
    top: globalNumber(props, 'safeAreaTop'),
    bottom: globalNumber(props, 'safeAreaBottom'),
  }
}
```

首先確認目前是原生環境，且收到物件形式的 props，再檢查是否為全螢幕模式。符合條件時，讀取頂部與底部的安全區；缺少有效數值時使用 `0`。

App 會把結果用在 shell、頂部導覽和語言選單的間距。這裡使用平台回報的尺寸，避免為不同裝置寫固定高度。目前數值在建立 App 時取得，旋轉、分割視窗和重新進入的結果仍需要實機確認。

`fullscreen` 是載入 Lynx bundle 時的選項；文件 webview 使用的 `embedded` 則控制文件導覽的呈現，兩個參數位於不同的載入層。

## 正式圖片為什麼沒有放在 bundle 前綴下？

目前原生 bundle 使用 `https://lynns.me/lynx/` 作為建置資源前綴，不過 `public/images/` 會複製到網站根目錄下的 `/images/`。這兩種來源的輸出位置不同。

因此 [runtime.ts](https://github.com/clhuang224/web/blob/main/src/platform/runtime.ts) 另外處理 public 圖檔：

```ts
const publicOrigin = import.meta.env.DEV
  ? import.meta.env.ASSET_PREFIX
  : 'https://lynns.me'

export function asset(path: string) {
  return isStandalone() ? `${publicOrigin}${path}` : path
}
```

開發模式沿用開發服務的資源前綴；正式模式則用網站根網址。`asset()` 在原生端把它接到 `/images/...` 前面，Web 端繼續使用原本的根路徑。

如果把這些圖片也接在 `/lynx/` 下，產生的網址就不符合實際輸出位置。這個例子可以看出：bundle 能載入，和 bundle 使用的圖片能載入，需要分別確認。

## 如何比較同一個功能？

先在 Web 與 Android 選同一件作品，確認使用相同的專案版本，再比較實際操作。Android 可以使用 Pixel 9a，並記錄 Explorer、系統版本和連線方式：

1. 冷啟動時字樣、圖示和原始塗鴉是否完整。
2. 手機輪播是否單張、能前後切換及暫停。
3. 作品和塗鴉詳情頁、三語切換是否保留身分。
4. 外部網站開啟與關閉後是否回到正確位置。
5. 旋轉、背景返回、系統返回和輔助工具的結果。

這些步驟檢查目前已實作的功能，尚未替每個情境建立通過紀錄。結果需要有環境和操作步驟，才能成為讀者可重做的教學。

## 從差異回到平台分工

同一個輪播規則可以共用，圖片、網址與網頁能力卻需要不同接法。把同一個操作在兩端的結果並列，就能確認哪些責任屬於元件，哪些需要 host 提供。

原生動態偏好同步等尚未完成的方向，放在[實驗章節](experiments.md)。這一篇則保留目前實作與已確認的相容性問題，讓閱讀順序跟著現有功能走。
