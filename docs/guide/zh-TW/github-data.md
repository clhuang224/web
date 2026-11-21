# GitHub 資料怎麼進畫面

作品頁已經有摘要和連結，如果再放上 GitHub 的主要語言、星星數和更新日期，好像會比較完整。不過這些資訊要打 API，也就多了等待和失敗的情況。

所以作品本身的介紹先放在本地資料，GitHub 資訊再另外補上。即使請求沒有成功，作品和連結還是能看。

從 [ProjectPage.vue](https://github.com/clhuang224/web/blob/main/src/pages/ProjectPage.vue) 開始，接著讀 [repository.ts](https://github.com/clhuang224/web/blob/main/src/domain/repository.ts)。

## 頁面先決定要問哪個 repository

頁面依目前的作品 ID 找到資料，再把 `project.source` 轉成 `owner/repository`。目前的 `repositoryFromSource` 接受預期的 GitHub HTTPS 網址形狀，對不符合的值回傳 `null`。

它刻意處理本專案使用的來源格式，不是通用 Git URL 解析器。若未來要接受 SSH、子路徑、query 或其他平台，應先補明確需求與測試。

頁面用 `watch` 監看 repository 名稱，並設定 `immediate: true`。`watch` 原本是在資料變化後執行回呼，`immediate` 則讓它建立時先執行一次，因此第一次進入與切換作品都能提出資料要求。

## 為什麼回應先當 unknown？

先看最後想留給畫面的資料：

```ts
export interface RepositorySummary {
  name: string
  language: string | null
  stars: number
  pushedAt: string
}
```

GitHub 回應裡的欄位很多，這裡只留下畫面會用的四個。`language` 允許 `null`，表示沒有取得主要語言時，也能保留其他資訊。

`string | null` 是聯集型別，表示值可能是字串，也可能沒有語言資料。頁面使用前需要先判斷，才能安全地依字串處理。

再看請求的入口：

```ts
export function fetchRepository(
  name: string,
): Promise<RepositorySummary | null> {
  return fetch(`https://api.github.com/repos/${name}`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
    .then((response) => (response.ok ? response.json() : null))
    .then(parseRepository)
    .catch(() => null)
}
```

第一個 `then` 先看 HTTP 結果，成功才讀 JSON。接著交給 `parseRepository` 檢查名稱、語言、星星數和日期，轉成上面的格式。網路或解析過程出了錯，最後回傳 `null`。

`Promise<RepositorySummary | null>` 描述非同步結果：函式先回傳 Promise，完成後才得到摘要或 `null`。`then` 把完成後的值交給下一步；`catch` 處理這條鏈上的錯誤。

也就是說，`response.json()` 之後還有一步要做：確認拿到的資料真的符合頁面需要的條件。

這和直接寫 `as RepositorySummary` 不同：型別斷言只告訴 TypeScript 接受這個假設，不會替實際資料補欄位或修正型別。

`unknown` 則保留「還不知道格式」的限制，必須先用實際條件檢查，才能讀取已知欄位。像 `isRepositorySummary(value): value is RepositorySummary` 這種宣告，會在檢查成功的分支縮小型別；條件本身仍由函式負責。可以對照 [TypeScript 的型別縮小說明](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)。

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

目前使用無憑證的公開請求，沒有在前端嵌入 GitHub token。

## 與建置時快照比較

目前在執行時請求，能取得請求當下的 GitHub 資料，代價是頁面需要處理等待與失敗。

另一種做法是在建置時取得資料，讓頁面直接讀快照。這可以減少訪客開頁時的 API 依賴，但資料更新需要重新產生，快照建立失敗也要有處理方式。

本專案尚未採用快照。具體比較步驟放在[實驗章節](experiments.md)，主章節仍以現在的請求流程為準。

## 這個功能的延伸價值

這個功能的程式不算很多，卻剛好經過了三件事：拿外部資料、整理成自己需要的格式、決定沒有資料時要顯示什麼。

同樣的思路可以用在其他 API、原生 bridge 訊息與設定檔。關鍵不是多寫幾個型別，而是讓可信程度不同的資料有明確進入點。

可以對照 [repository.test.ts](https://github.com/clhuang224/web/blob/main/src/domain/repository.test.ts) 看已覆蓋的解析案例，再到[測試與可及性](testing-and-accessibility.md)區分規則測試與整體體驗。
