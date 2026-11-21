# 從 Vue 到 Lynx

先打開 [src/index.ts](https://github.com/clhuang224/web/blob/main/src/index.ts)。整個入口很短：

```ts
import { createApp } from 'vue-lynx'
import App from './App.vue'
import { router } from './app/router'

const app = createApp(App)
app.use(router)
app.mount()
```

建立 app、安裝 Router，然後掛載。看起來跟平常寫 Vue 很接近，只是 `createApp` 換了一個來源，`mount()` 也沒有指定 `#app`。

原因在渲染的那一端。Vue 繼續處理元件和反應式資料，接著由 VueLynx 把結果交給 Lynx；不用在這個入口找一個 DOM 容器來放畫面。

## 熟悉的部分留在哪裡？

[DoodleCarousel.vue](https://github.com/clhuang224/web/blob/main/src/components/DoodleCarousel.vue) 使用 `ref` 記住索引與播放選擇，`computed` 推導可見圖片，`watch` 處理版面狀態變化，並在卸載時清除計時器。

所以讀元件的時候，可以先照熟悉的方式分辨：哪些是狀態？哪些跟著狀態算出來？計時器什麼時候建立，又在哪裡清掉？先把這條資料流讀完，再來看元素和平台的差異。

本專案的 Composition API 從 `vue-lynx` 匯入。[官方入門對照](https://vue.lynxjs.org/guide/introduction)也以這種方式介紹從 Vue Web 轉換過來的差異。

## 元素變了，文字也有自己的位置

專案元件使用 `<view>`、`<text>`、`<image>` 和 `<scroll-view>`。例如 [SectionTitle.vue](https://github.com/clhuang224/web/blob/main/src/components/SectionTitle.vue) 用 view 排列裝飾，再用 text 顯示標題。

| 想表達的內容 | 本專案的常見寫法 | 閱讀時的重點                             |
| ------------ | ---------------- | ---------------------------------------- |
| 排版容器     | `<view>`         | 它不是可任意操作的 HTML div。            |
| 文字         | `<text>`         | 文字由文字元素承接，不直接放在 view 裡。 |
| 圖片         | `<image>`        | 載入方式和 SVG 支援要看平台。            |
| 捲動區       | `<scroll-view>`  | 捲動能力由 Lynx 元素提供。               |

這時候如果想把慣用的元件庫搬進來，就要多看一下它依賴什麼。如果裡面會呼叫 `document.querySelector()`、取得 DOM 節點或操作瀏覽器事件，光是能匯入 `.vue` 還不夠。

## 事件名稱看起來像 Vue，語意來自 Lynx

輪播的下一張使用 `@tap="manualAdvance(1)"`。`@` 是熟悉的綁定語法，`tap` 則是 Lynx 的事件。

因此可以繼續用函式追操作，但不要把 DOM 的所有預設行為一起帶過來。尤其是鍵盤、焦點、事件傳播和主執行緒互動，需要對照實際 runtime；詳見[測試與可及性](testing-and-accessibility.md)。

## 元件怎麼拿到共用操作？

[App.vue](https://github.com/clhuang224/web/blob/main/src/App.vue) 呼叫 `useHost()`，透過 `provide` 提供共用物件。頁面使用 [useSite()](https://github.com/clhuang224/web/blob/main/src/app/context.ts) 取回 `state`、`navigate` 等操作。

這仍然是 Vue 的 provide/inject。差別在提供的內容：它把網站頁面和平台能力接在一起，讓元件可以表達「打開作品頁」，不必自己操作瀏覽器網址。

## 先練習分辨這三種程式

1. `visibleCount(compact)`：只計算張數，不需要 renderer。
2. `computed(() => ...)`：把資料變化接到 Vue 狀態。
3. `nativeHost()?.navigate(...)`：需要跨到平台邊界。

你已經可以把一個 VueLynx 功能拆成規則、反應式狀態與平台接點。下一篇用[輪播](carousel.md)把這三者接起來。
