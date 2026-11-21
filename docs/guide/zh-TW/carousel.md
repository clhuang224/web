# 從下一張按鈕讀懂輪播

輪播看起來就是隔一段時間換張圖，不過這裡還有一個條件：桌面一次兩張，手機一次一張，手動按下一組也要跟著變。

所以先從「現在顯示哪些圖」開始，再一路看到下一張按鈕和計時器。這幾段讀完，就能看出 Vue 狀態和換組規則怎麼配合。

## 1. 先認出熟悉的 Vue 狀態

打開 [DoodleCarousel.vue](https://github.com/clhuang224/web/blob/main/src/components/DoodleCarousel.vue)。先看這幾行：

```ts
const { state, navigate } = useSite()
const text = computed(() => copy[state.value.locale])
const count = computed(() => visibleCount(state.value.compact))
const index = ref(0)
const playing = ref(true)
const visible = computed(() =>
  doodles.slice(index.value, index.value + count.value),
)
```

先看 `index`，它記住第一張可見圖片的位置，從 `0` 開始。`count` 決定一次取幾張，所以 `visible` 就能用 `slice` 從 [doodles.ts](https://github.com/clhuang224/web/blob/main/src/content/doodles.ts) 取出對應的範圍。

`playing` 則是另一件事：它記住目前要不要自動播放。把位置和播放選擇分開，暫停時就可以保留原本的圖片，也仍然能手動切換。

`state.compact` 來自 `useSite()` 提供的共用狀態。輪播本身不讀 `window.innerWidth`。瀏覽器端由 host 監看寬度，再傳給元件；standalone 路徑則使用 `SystemInfo` 計算初始狀態。兩條路徑仍需各自驗證，不能只因共用元件就視為行為完全相同。

在 [carousel.ts](https://github.com/clhuang224/web/blob/main/src/domain/carousel.ts) 裡，張數規則很短：

```ts
export function visibleCount(compact: boolean): number {
  return compact ? 1 : 2
}
```

因此桌面 `count = 2`，手機 `count = 1`。當 `index = 0` 時，桌面會取位置 `0`、`1`；手機只取位置 `0`。

## 2. 跟著下一張按鈕走

元件的下一張按鈕有這個綁定：

```vue
@tap="manualAdvance(1)"
```

你熟悉的 Vue 事件綁定仍然存在，但這裡用 Lynx 的 `tap`。在 VueLynx 裡，`@tap` 是常見 Lynx 事件綁定的語法糖；不要直接假設它具有所有 DOM `click` 的行為。[官方事件介紹](https://vue.lynxjs.org/guide/introduction#different-events)有更完整的對照。

`manualAdvance` 的實作是：

```ts
function manualAdvance(direction: 1 | -1) {
  advance(direction)
  schedule()
}
```

`1` 表示往後一組，`-1` 表示往前一組。`advance` 呼叫 `stepIndex` 計算新位置；`schedule` 重新安排計時器。如果正在播放，手動操作後會重新等候一個播放間隔；如果已暫停，就維持暫停。

這個分工讓按鈕只處理操作意圖，不需要自己計算桌面和手機各要跳幾張。

## 3. 為什麼另外寫 stepIndex？

[carousel.ts](https://github.com/clhuang224/web/blob/main/src/domain/carousel.ts) 的 `stepIndex` 只接收數字並回傳新索引。它不認識 Vue、Lynx、圖片網址或計時器。

| 操作               | 起始索引 | 每組張數 | 下一個索引 |
| ------------------ | -------- | -------- | ---------- |
| 桌面按下一組       | `0`      | `2`      | `2`        |
| 桌面從最後一組往後 | `12`     | `2`      | `0`        |
| 手機按下一張       | `0`      | `1`      | `1`        |
| 手機從最後一張往後 | `13`     | `1`      | `0`        |

這些結果以目前的 `14` 張圖片為例。函式先把位置換成組別，加上前進或後退的方向，繞回有效組別，最後換回圖片索引。

另一個函式 `alignIndex` 處理版面切換。假設手機正在看索引 `13`，改成桌面時會對齊索引 `12`，讓原本那張仍在 `12`、`13` 這一組中。

元件只要監看張數的變化：

```ts
watch(count, (value) => {
  index.value = alignIndex(index.value, doodles.length, value)
})
```

## 4. 自動播放如何共用規則？

`schedule()` 先清除舊的 interval，再根據兩個狀態決定是否建立新的計時器：

- `playing`：使用者目前是否選擇播放。
- `reducedMotion`：平台是否回報減少動態效果的偏好。

條件允許時，每 `6` 秒呼叫一次 `advance(1)`。因此自動播放和下一張按鈕使用相同的換組算法，不會各自維護一套桌面／手機規則。元件卸載時會清除計時器，避免離開首頁後還繼續執行。

目前收到減少動態效果的設定時，元件也會把 `playing` 改為 `false`。偏好解除後不會自行把這個值改回 `true`。這是讀程式時應注意的狀態行為；實際呈現仍需配合平台驗證。

## 哪些地方屬於 Lynx？

到這裡，大部分都是你熟悉的 Vue 和 TypeScript。真正不同的地方，主要在畫面與平台接點：

| 位置           | 這個專案的寫法                   | 要注意什麼                                         |
| -------------- | -------------------------------- | -------------------------------------------------- |
| 元素           | `<view>`、`<text>`、`<image>`    | 交給 Lynx renderer，不是一般 DOM 元素。            |
| 操作           | `@tap`                           | 使用 Lynx 事件系統。                               |
| 圖片網址       | `asset(doodle.src)`              | runtime adapter 區分瀏覽器與 standalone 資源前綴。 |
| 寬度與動態偏好 | `useSite()` 提供的狀態           | 能力由平台提供，元件使用結果。                     |
| 打開塗鴉頁     | `navigate('drawing', doodle.id)` | 元件提出導航意圖，平台與路由負責後續處理。         |

## 怎麼知道規則有沒有寫對？

現有的 [carousel.test.ts](https://github.com/clhuang224/web/blob/main/src/domain/carousel.test.ts) 會檢查完整一輪是否剛好看過每張圖、前後切換能否繞回、版面切換能否保留目前圖片，以及空集合是否回到安全索引。

這些測試能驗證計算規則。它們沒有啟動 Lynx 畫面，所以還不能證明圖片成功載入、按鈕可操作、計時器行為、鍵盤操作或 Android 效果。這幾項需要另外驗證。上方表格可以直接呼叫純函式核對；整體互動則需要到應用程式中檢查。

## 可以怎麼延伸？

最直接的學習價值，是看出一個功能可以分成三部分：**換組規則、Vue 狀態與互動、平台提供的能力。**

之後試 Android 時，可以先保留 `stepIndex` 和資料清單，專心驗證圖片資源、螢幕狀態、生命週期與導航。如果再做滑動手勢，先釐清事件和執行緒需求，再決定哪些計算能沿用，避免把手勢處理直接塞進純函式。

文件也可以用同一組純函式做互動解說，讓讀者切換張數、位置和方向，立刻看到下一個索引。那會是規則的示範；實際 Lynx 畫面的驗證仍然回到應用程式與裝置。

接著讀[平台能力怎麼接起來](runtime-bridge.md)，或[回到閱讀地圖](reading-map.md)。
