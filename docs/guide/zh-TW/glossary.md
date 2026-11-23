# 名詞對照

這裡以 Lynn’s 的用法解釋名詞。需要完整 API 定義時，再沿著各章節的官方連結查閱。

## Vue 與 TypeScript 基礎

| 名詞             | 在這個專案裡怎麼理解                                    | 相關章節                                           |
| ---------------- | ------------------------------------------------------- | -------------------------------------------------- |
| Composition API  | 用函式組合 Vue 元件的狀態、計算與生命週期。             | [Vue 到 Lynx](vue-to-lynx.md)                      |
| `ref` / `.value` | 保存反應式狀態；script 透過 `.value` 讀寫它。           | [輪播](carousel.md)                                |
| `computed`       | 由其他反應式資料推導結果，例如目前可見的圖片。          | [輪播](carousel.md)                                |
| `watch`          | 監看資料變化，執行需要額外動作的回呼。                  | [輪播](carousel.md)、[GitHub 資料](github-data.md) |
| `shallowRef`     | 追蹤最外層值的替換，不自動追蹤物件所有深層欄位。        | [平台轉接](runtime-bridge.md)                      |
| Props            | 父元件傳給子元件的資料。                                | [Vue 到 Lynx](vue-to-lynx.md)                      |
| Provide / inject | 上層提供共用值，下層透過相同 key 取得。                 | [Vue 到 Lynx](vue-to-lynx.md)                      |
| `interface`      | 描述物件應有的欄位與型別，不會替 runtime 自動驗證資料。 | [三語內容](content-and-i18n.md)                    |
| 泛型 / `T`       | 讓同一個型別結構接受不同的內容型別。                    | [三語內容](content-and-i18n.md)                    |
| `Record<K, T>`   | 描述一組鍵為 K、值為 T 的物件。                         | [三語內容](content-and-i18n.md)                    |
| `unknown`        | 尚未確認格式的值，需要檢查後才能當成特定資料使用。      | [GitHub 資料](github-data.md)                      |
| 聯集型別 / `\|`  | 值可能是列出的幾種型別或常值，例如字串或 null。         | [GitHub 資料](github-data.md)                      |
| `ReturnType`     | 取得函式回傳值的型別，讓共用介面跟著函式變更。          | [Vue 到 Lynx](vue-to-lynx.md)                      |
| Promise          | 代表稍後才完成的非同步結果。                            | [GitHub 資料](github-data.md)                      |

## 渲染、平台與工程

Runtime 是程式實際執行的環境，與把原始碼轉成輸出的建置工具不同。Shell 則是承載頁面的外殼；本專案用 Explorer 作為原生頁面的測試外殼。

| 名詞            | 在這個專案裡怎麼理解                                                              | 相關章節                                           |
| --------------- | --------------------------------------------------------------------------------- | -------------------------------------------------- |
| Renderer        | 把 Vue 元件結果接到實際元素與畫面的機制。VueLynx 的目標是 Lynx。                  | [Vue 到 Lynx](vue-to-lynx.md)                      |
| SFC             | `.vue` 元件檔案，組合 script、template 與樣式。檔案形式相同，不代表渲染目標相同。 | [Vue 到 Lynx](vue-to-lynx.md)                      |
| Host            | 提供執行容器與平台能力的一端；Web 端是本專案的瀏覽器外殼。                        | [平台邊界](runtime-bridge.md)                      |
| Bridge          | 應用程式與平台之間有明確格式的操作與資料通道。                                    | [平台邊界](runtime-bridge.md)                      |
| NativeModule    | Lynx 向 host 能力發出呼叫的介面形式。本專案自訂 SiteHost。                        | [平台邊界](runtime-bridge.md)                      |
| standalone      | 本專案對原生 shell 路徑的稱呼，不依靠網站的瀏覽器 host。                          | [原生探索](native-exploration.md)                  |
| Memory history  | 應用程式內部的路由歷程，不直接管理瀏覽器網址列。                                  | [路由](routing.md)                                 |
| History API     | Web host 用來維護瀏覽器位置與前後頁的能力。                                       | [路由](routing.md)                                 |
| Locale          | 語言與地區的識別值，本專案使用 zh-TW、en、ja。                                    | [三語內容](content-and-i18n.md)                    |
| Manifest / 清單 | 程式可讀的內容描述，例如塗鴉 ID、圖片路徑和翻譯。                                 | [內容維護](maintaining-content.md)                 |
| 純函式          | 對相同輸入回傳相同結果，沒有網路、畫面操作等外部副作用的函式。                    | [輪播](carousel.md)                                |
| 副作用          | 計時器、網路請求、儲存或平台操作等超出單純計算的行為。                            | [輪播](carousel.md)、[GitHub 資料](github-data.md) |
| Type guard      | 檢查 runtime 值並縮小 TypeScript 型別的函式，例如 isHostState。                   | [GitHub 資料](github-data.md)                      |
| Bundle          | 經建置處理後供 runtime 載入的程式資源；格式和用途要看目標。                       | [建置](build-and-hosting.md)                       |
| 資源前綴        | 圖檔等資源網址的基礎位置；原生 shell 不一定擁有網站的根目錄概念。                 | [素材](styling-and-assets.md)                      |
| Fallback        | 主要路徑未完成或失敗時提供的替代呈現，例如載入失敗提示與網誌入口。                | [建置](build-and-hosting.md)                       |
| Webview         | App 內顯示網頁內容的元件。它和載入 Lynx bundle 是不同用途。                       | [原生探索](native-exploration.md)                  |
| 可及性          | 讓不同輸入方式與輔助工具能理解並操作網站的能力。                                  | [測試與可及性](testing-and-accessibility.md)       |

`src/domain/` 是專案的目錄命名，不代表裡面每個函式都是純函式。例如 `repositoryFromSource` 只處理字串，但資料夾裡也可能放和外部格式打交道的解析函式。閱讀時以實際依賴和行為判斷，不只依賴資料夾名稱。
