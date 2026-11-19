# GitHub 資料怎麼進畫面

作品頁的摘要、正式連結和原始碼來自本地內容；主要語言、星星數與更新日期則向 GitHub 取得。兩種資料分開，讓附加資訊失敗時，作品仍然能被介紹。

從 [ProjectPage.vue](https://github.com/clhuang224/web/blob/main/src/pages/ProjectPage.vue) 開始，接著讀 [repository.ts](https://github.com/clhuang224/web/blob/main/src/domain/repository.ts)。

## 頁面先決定要問哪個 repository

頁面依目前的作品 ID 找到資料，再把 `project.source` 轉成 `owner/repository`。目前的 `repositoryFromSource` 接受預期的 GitHub HTTPS 網址形狀，對不符合的值回傳 `null`。

它刻意處理本專案使用的來源格式，不是通用 Git URL 解析器。若未來要接受 SSH、子路徑、query 或其他平台，應先補明確需求與測試。

頁面用 immediate watch 監看 repository 名稱，因此第一次進入與切換作品都能提出資料要求。

## 為什麼回應先當 unknown？

`response.json()` 取得資料，不代表資料就符合頁面需要的型別。`parseRepository` 從外部物件中檢查名稱、語言、星星數和日期，成功後轉成較小的 `RepositorySummary`，失敗則回傳 `null`。

這和直接寫 `as RepositorySummary` 不同：型別斷言只告訴 TypeScript 接受這個假設，不會替實際資料補欄位或修正型別。

目前驗證只涵蓋程式寫出的條件。它不是完整 GitHub schema 驗證，也沒有對所有數值範圍提出保證。

## Web 與原生端怎麼分工？

| 環境       | 請求路徑                                               | 結果如何回頁面                      |
| ---------- | ------------------------------------------------------ | ----------------------------------- |
| Web        | 元件 → SiteHost bridge → 瀏覽器 host → 共用 fetch 函式 | `repository` 事件，再更新共用狀態。 |
| standalone | 應用程式直接呼叫共用 fetch 函式                        | 驗證後更新共用狀態。                |

Web host 只為作品清單中已知的 repository 提供查詢。它用 Map 記住請求 Promise；同一次頁面生命週期重複查詢時，可以沿用請求結果。

這不是永久快取，沒有自動刷新期限，而且失敗的結果也可能被沿用。原生端主要避免重複取得已有成功資料，行為不完全相同。若需要重試或離線支援，要另行設計狀態與更新規則。

## 失敗會看到什麼？

共用 fetch 函式遇到非成功狀態、解析失敗或網路錯誤時回傳 `null`。頁面只在 `repository` 存在時顯示附加資料區。

因此看不到星星數，不能立刻推論星星數為零；可能只是尚未取得資料。也不要把省略資訊描述成完整的離線功能，因為圖片、頁面資源和外部目的地仍有自己的網路需求。

目前使用無憑證的公開請求，沒有在前端嵌入 GitHub token。若將來公開流量需要不同策略，可考慮建置時產生快照，但要讓讀者知道資料的更新時間與來源。

## 這個功能的延伸價值

這是一個小型的資料邊界案例：外部格式先驗證，再縮成內部需要的模型，最後由畫面決定缺少資料時如何呈現。

同樣的思路可以用在其他 API、原生 bridge 訊息與設定檔。關鍵不是多寫幾個型別，而是讓可信程度不同的資料有明確進入點。

可以對照 [repository.test.ts](https://github.com/clhuang224/web/blob/main/src/domain/repository.test.ts) 看已覆蓋的解析案例，再到[測試與可及性](testing-and-accessibility.md)區分規則測試與整體體驗。
