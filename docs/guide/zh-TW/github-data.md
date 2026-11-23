# GitHub 資料怎麼進畫面

作品頁已經有摘要和連結，如果再放上 GitHub 的主要語言、星星數和更新日期，好像會比較完整。不過這些資訊要打 API，就會多出等待、失敗和次數限制。

所以這個網站在建置時抓一次資料，存成快照，訪客開頁時直接讀快照，完全不需要呼叫 GitHub。

從 [generate-repositories.mjs](https://github.com/clhuang224/web/blob/main/scripts/generate-repositories.mjs) 開始，接著讀 [repository.ts](https://github.com/clhuang224/web/blob/main/src/domain/repository.ts) 和 [ProjectPage.vue](https://github.com/clhuang224/web/blob/main/src/pages/ProjectPage.vue)。

## 先決定要問哪些 repository

腳本讀取作品清單，再用 `repositoryFromSource` 把每個 `project.source` 轉成 `owner/repository`。它接受預期的 GitHub HTTPS 網址形狀，對不符合的值回傳 `null`，所以只有作品清單裡的 repository 會被查詢。

它刻意處理本專案使用的來源格式，不是通用 Git URL 解析器。若未來要接受 SSH、子路徑、query 或其他平台，應先補明確需求與測試。

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

腳本拿到 JSON 之後，不會直接寫成 `as RepositorySummary`。型別斷言只告訴 TypeScript 接受這個假設，不會替實際資料補欄位或修正型別。`parseRepository` 收下 `unknown`，逐一檢查名稱、語言、星星數和日期，通過才回傳摘要，否則回傳 `null`。

`unknown` 保留「還不知道格式」的限制，必須先用實際條件檢查，才能讀取已知欄位。可以對照 [TypeScript 的型別縮小說明](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)。

目前驗證只涵蓋程式寫出的條件。它不是完整 GitHub schema 驗證，也沒有對所有數值範圍提出保證。

## 快照怎麼產生？

`pnpm run generate:repositories` 對每個 repository 呼叫一次公開 API，把通過檢查的摘要寫進 `src/content/generated/repositories.ts`。`pnpm run build` 會先跑這一步，所以每次部署都會更新資料。

有設定 `GITHUB_TOKEN` 環境變數時，腳本會帶上它，避開未驗證請求的次數限制；token 只存在建置環境，不會進入網站。

某個 repository 這次取不到時，腳本沿用上一份快照裡的資料，不會因為一次網路失敗就讓頁面上的資訊消失。快照檔案也一起提交，所以離線開發時仍有資料可看。

## 頁面怎麼讀？

頁面依目前的作品 ID 找到 repository 名稱，再從快照物件取出摘要。快照在建置時就已經寫進程式，Web 和原生 App 讀到的是同一份資料，不需要經過 bridge，也沒有載入中的狀態。

快照裡沒有某個 repository 時，頁面只在 `repository` 存在時顯示附加資料區。因此看不到星星數，不能推論星星數為零；可能只是快照沒有取得資料。

## 和執行時請求比較

執行時請求能拿到開頁當下的資料，代價是每位訪客都要等待 API，還可能遇到失敗或每小時 60 次的限制。

快照的資料只在重新建置時更新，像星星數這種會變動的數字可能落後幾天。對個人網站來說，這個落差可以接受，換來的是穩定、快速，而且少了一整段 bridge 與快取程式。

## 這個功能的延伸價值

這個功能的程式不算很多，卻剛好經過了三件事：拿外部資料、整理成自己需要的格式、決定沒有資料時要顯示什麼。

同樣的思路可以用在其他 API、原生 bridge 訊息與設定檔。關鍵不是多寫幾個型別，而是讓可信程度不同的資料有明確進入點。

可以對照 [repository.test.ts](https://github.com/clhuang224/web/blob/main/src/domain/repository.test.ts) 看已覆蓋的解析案例，再到[測試與可及性](testing-and-accessibility.md)區分規則測試與整體體驗。
