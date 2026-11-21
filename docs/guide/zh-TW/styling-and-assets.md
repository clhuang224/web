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

## CSS 變數與繼承不是理所當然

[lynx.config.ts](https://github.com/clhuang224/web/blob/main/lynx.config.ts) 啟用 CSS inline variables 與 inheritance 支援。閱讀 `site.css` 的 `var(...)` 時，要把這個編譯設定一起考慮。

目前標題描邊使用分層 `text-shadow`，字體則隨專案提供 jf open huninn。瀏覽器 host 和原生樣式各自宣告字體，避免把瀏覽器的字體載入方式直接套到原生端。

字體來源相同，仍需要確認三語字形、行高與容器裁切。這些是實際渲染結果，不能只看字體檔案是否存在。

設計來源是 [Figma](https://www.figma.com/design/OzWLzG1nfBsVsRTJw029Y4?node-id=2-4)。對照時要區分來源元件、已確認的響應式改動，以及 runtime 上的實際呈現。

## 原始素材為什麼不直接裁切？

`public/images/doodles/` 保留 14 張原始 PNG，尺寸都是 `851 × 315`。編號是穩定清單 ID，不代表創作年份，也不應從編號推測故事或時間順序。

圖片完整性與畫面呈現是不同責任。框線、留白、縮放與 `aspectFit` 可以在元件處理；更換或重新命名來源檔時，還要維護素材目錄與清單。

原始檔對照與來源記錄在[素材文件](https://github.com/clhuang224/web/blob/main/docs/assets.md)。替代描述依圖片可確認內容撰寫，不補上未確認的個人故事。

## 同一張 SVG 為什麼需要 VectorImage？

[VectorImage.vue](https://github.com/clhuang224/web/blob/main/src/components/VectorImage.vue) 在 Web 使用 `<image>`，在 standalone 使用 `<svg>`，並透過 `asset()` 取得原生端可使用的圖片位址。

這個包裝來自本專案的原生端顯示需求。頁面仍然表達「這裡需要圖示」，平台差異集中在包裝元件；但每個 shell 的實際支援仍要驗證。

介面圖示使用本地輸出的 Remix Icon SVG，品牌字樣則保留原始 artwork。修改圖示產生流程時，也要留意既有授權檔與來源記錄。

## 改樣式時怎麼檢查？

先選一個元件和一種狀態，再看桌面、手機、三語和鍵盤焦點。若動到共用色彩或字級，擴大檢查使用它們的元件；若動到資源網址，也要驗證原生端載入。

這樣才能區分「CSS 有寫出來」、「畫面看起來接近設計」與「不同情境下仍然能使用」。
