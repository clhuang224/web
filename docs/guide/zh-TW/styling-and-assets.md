# 樣式、UnoCSS 與圖檔

網站保留了原始字樣、塗鴉、淡水藍底和珊瑚粉元件。實作時需要把兩件事分開：來源素材如何保存，以及畫面如何使用這些素材。

首先看樣式的分工，再看 UnoCSS 和原生端圖檔的處理。

## 樣式放在哪裡？

| 位置                  | 責任                                     |
| --------------------- | ---------------------------------------- |
| `src/styles/site.css` | 語意色彩、版面、卡片、標題與控制項樣式。 |
| `uno.config.ts`       | UnoCSS 掃描範圍與 preset 設定。          |
| `src/styles/uno.css`  | 由工具產生的 utility CSS。               |
| `src/host/host.css`   | 瀏覽器外殼、載入與錯誤提示。             |

原始碼連結見[地圖](source-map.md)。不要直接維護產生的 `uno.css`；下次建置可能覆蓋它。

## UnoCSS 在這裡怎麼工作？

目前使用 CLI 掃描 `src/**/*.vue`，產生 utility CSS，再由 App 匯入。開發時另外啟動 watch。這個整合沒有依賴 Vite plugin。

`flex`、`items-center` 這類小型排列可以用 utility；網站自己的卡片、品牌色與狀態則放在語意樣式中。兩者分工能讓共通設計集中，也保留局部排列的方便。

掃描器需要看得到 class。動態拼出只有執行時才存在的名稱，可能無法產生對應規則。另一個邊界是：CSS 產生成功，只能證明工具有輸出，不能證明 Lynx runtime 支援每一條 CSS。

另一種做法是只使用語意 CSS，把每種排列和元件樣式都集中在樣式檔。它少了一個 utility 產生步驟，但小型排列也需要建立 class。目前的實作混合兩者：常見排列使用 utility，品牌和元件規則留在 `site.css`，因此閱讀時要知道這兩種樣式來源。

## 標籤顏色如何決定？

技術標籤的顏色由 [tags.ts](https://github.com/clhuang224/web/blob/main/src/content/tags.ts) 集中管理。React、Vue、TypeScript 等名稱各自對應一個顏色，未列出的名稱則使用預設值：

```ts
export function tagColor(tag: string) {
  return tagColors[tag] ?? fallbackTagColor
}
```

`TagList` 逐一讀取標籤，呼叫這個函式取得背景色。這樣同一個技術在不同卡片上仍然使用相同顏色，增加新的名稱也只需要調整對照表。

這個例子也說明了 utility 與資料對照的分工：標籤的形狀放在 CSS，隨名稱改變的顏色則由資料決定。

## CSS 變數與繼承不是理所當然

[lynx.config.ts](https://github.com/clhuang224/web/blob/main/lynx.config.ts) 啟用 CSS inline variables 與 inheritance 支援。閱讀 `site.css` 的 `var(...)` 時，要把這個編譯設定一起考慮。

目前標題描邊使用分層 `text-shadow`，字體則隨專案提供 jf open huninn。瀏覽器 host 和原生樣式各自宣告字體，避免把瀏覽器的字體載入方式直接套到原生端。

字體來源相同，仍需要確認三語字形、行高與容器裁切。這些是實際渲染結果，不能只看字體檔案是否存在。

設計來源是 [Figma](https://www.figma.com/design/OzWLzG1nfBsVsRTJw029Y4?node-id=2-4)。對照時要區分來源元件、已確認的響應式改動，以及 runtime 上的實際呈現。

## 原始素材為什麼不直接裁切？

`public/images/doodles/` 保留 14 張原始 PNG，尺寸都是 `851 × 315`。編號是穩定清單 ID，不代表創作年份，也不應從編號推測故事或時間順序。

圖片完整性與畫面呈現是不同責任。框線、留白、縮放與 `aspectFit` 可以在元件處理；更換或重新命名來源檔時，還要維護素材目錄與清單。

原始檔對照與來源記錄在[素材文件](https://github.com/clhuang224/web/blob/main/docs/assets.md)。塗鴉不另寫標題或描述，只發布作者提供的原文。

## 圖片畫廊如何使用瀑布流？

[DrawingsPage.vue](https://github.com/clhuang224/web/blob/main/src/pages/DrawingsPage.vue) 讓圖片連結直接成為 Lynx `list` 的項目。每張圖片保留可及性標籤，畫廊裡不另外顯示編號或說明文字：

<!-- prettier-ignore -->
```vue
    <list
      :key="state.compact ? 'compact' : 'wide'"
      class="drawing-gallery"
      :list-type="state.compact ? 'single' : 'waterfall'"
      :span-count="state.compact ? 1 : 2"
      scroll-orientation="vertical"
      ><list-item
        v-for="doodle in doodles"
        :key="doodle.id"
        :item-key="doodle.id"
        ><DrawingCard :doodle="doodle" :label="text.drawingLabel"
      /></list-item>
    </list>
```

`v-for` 依序建立項目，Vue 的 `key` 用來辨認同一筆資料，`item-key` 則提供給 Lynx 列表。桌面使用兩欄 waterfall，將後續項目放入較短的欄；手機改成單欄。現在 14 張圖片都是相同比例，所以欄位高度會很整齊，圖片仍以完整比例顯示。

`list` 自己擁有捲動區域，因此 [App.vue](https://github.com/clhuang224/web/blob/main/src/App.vue) 不再把畫廊放進一般頁面的 `scroll-view`；`.drawing-gallery` 由 flex 取得可用高度。這個分工對應[官方列表說明](https://lynxjs.org/api/elements/built-in/list.html)的 viewport 要求，避免在內容高度無上限的容器裡再放捲動列表。

另一種做法是用 `scroll-view` 配合一般排列，一次建立所有卡片，對小型清單比較直接。目前改用列表來表達畫廊與欄位配置，則需要另外確認項目回收、捲動、切換版面與鍵盤操作；建置通過本身不能證明這些互動。

點進 [DrawingPage.vue](https://github.com/clhuang224/web/blob/main/src/pages/DrawingPage.vue) 才會看到作者已提供的日期和創作原文；輔助工具則讀到「塗鴉」加上 ID。原文與介面翻譯的分工可接著讀[三語內容](content-and-i18n.md)。

## Markdown 怎麼變成 Lynx 畫面？

塗鴉原文放在 `src/content/doodles/*.md`，About 則放在 `src/content/about.md`。`generate-content.mjs` 在建置時使用 gray-matter 讀取日期欄位，再用 markdown-it 解析正文，產生 `src/content/generated/` 裡的 `doodle-stories.ts` 和 `about.ts`。App 只讀取結果，不在訪客端重新解析 Markdown。

`MarkdownBlock` 是用 `kind` 區分段落、標題、清單、引用與程式碼的聯集型別。`MarkdownBody` 依種類選擇 Lynx 的 view 或 text，`MarkdownInline` 再套用粗體、斜體和連結；巢狀清單與引用由元件遞迴處理。這裡的遞迴，就是用同一個元件繼續渲染區塊裡的子區塊。

另一種方式是使用 host 提供的原生 Markdown 元素，但[官方說明](https://lynxjs.org/next/api/elements/built-in/markdown)要求 host 整合並註冊，Web 也有自己的支援邊界。目前使用共用 Lynx 元件，讓這份有限的 Markdown 格式在相同元件結構裡顯示；代價是要維護區塊轉換與呈現。支援的語法與編輯步驟列在[內容維護練習](maintaining-content.md)。

## 圖片載入前先顯示什麼？

[DoodleImage.vue](https://github.com/clhuang224/web/blob/main/src/components/DoodleImage.vue) 會先放一張低解析度縮圖，讓原圖在同一個位置載入。原圖觸發 `load` 後，元件把 `loaded` 改成 `true`，再移除縮圖；切換 `src` 時則用 `watch` 重設狀態。

縮圖由 `scripts/generate-placeholders.mjs` 讀取原始 PNG 產生，輸出到獨立的資料檔。它不會覆寫原始 artwork。這個做法提供載入期間的視覺內容，但沒有因此減少原圖本身的下載大小；載入速度與等待感仍要分開觀察。

## 同一張 SVG 為什麼需要 VectorImage？

[VectorImage.vue](https://github.com/clhuang224/web/blob/main/src/components/VectorImage.vue) 在 Web 使用 `<image>`，在 standalone 使用 `<svg>`，並透過 `asset()` 取得原生端可使用的圖片位址。

這個包裝來自本專案的原生端顯示需求。頁面仍然表達「這裡需要圖示」，平台差異集中在包裝元件；但每個 shell 的實際支援仍要驗證。

介面圖示使用本地輸出的 Remix Icon SVG，品牌字樣則保留原始 artwork。修改圖示產生流程時，也要留意既有授權檔與來源記錄。

## 改樣式時怎麼檢查？

先選一個元件和一種狀態，再看桌面、手機、三語和鍵盤焦點。若動到共用色彩或字級，擴大檢查使用它們的元件；若動到資源網址，也要驗證原生端載入。

這樣才能區分「CSS 有寫出來」、「畫面看起來接近設計」與「不同情境下仍然能使用」。
