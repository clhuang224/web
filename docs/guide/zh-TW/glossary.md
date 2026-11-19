# 名詞對照

這裡以 Lynn’s 的用法解釋名詞。需要完整 API 定義時，再沿著各章節的官方連結查閱。

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

`src/domain/` 是專案的目錄命名，不代表裡面每個函式都是純函式。例如 `fetchRepository` 仍會發出網路請求。閱讀時以實際依賴和行為判斷，不只依賴資料夾名稱。
