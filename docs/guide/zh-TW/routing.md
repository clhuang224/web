# 路由、網址與上一頁

點 Queener 作品卡時，應用程式要知道「顯示作品詳情，ID 是 queener」。Web 端還要讓網址變成 `/portfolio/queener`，讓重新整理、分享和上一頁能理解同一個位置。

這兩件事相關，但不由同一個 Router 包辦。

## 先認出頁面的身分

[site.ts](https://github.com/clhuang224/web/blob/main/src/domain/site.ts) 區分列表頁與詳情頁。詳情頁需要 ID；列表頁沒有 ID。`HostState` 再把語言、版面與減少動態效果狀態一起傳入。

`project` 是頁面種類，`queener` 是內容 ID，`portfolio` 是公開網址中的區段。它們不必用同一個字。

[catalog.ts](https://github.com/clhuang224/web/blob/main/src/content/catalog.ts) 從作品和塗鴉清單產生有效 ID。這讓路由驗證可以跟著內容清單更新，避免另外手抄一份 ID 表。

## 同一件作品可以有三種公開網址

| 語言     | 公開位置                |
| -------- | ----------------------- |
| 繁體中文 | `/portfolio/queener`    |
| 英文     | `/en/portfolio/queener` |
| 日文     | `/ja/portfolio/queener` |

[navigation.ts](https://github.com/clhuang224/web/blob/main/src/domain/navigation.ts) 的 `pathForPage` 產生路徑，`parseSitePath` 則把路徑還原成語言、頁面和 ID，並檢查是否匹配。

對外部輸入做解析時，合法的字串形狀和真的存在的作品是兩個問題。`/portfolio/missing` 看起來像詳情路徑，但若清單沒有這個 ID，就不應視為已找到內容。

## 為什麼裡面用 memory history？

[app/router.ts](https://github.com/clhuang224/web/blob/main/src/app/router.ts) 使用 `createMemoryHistory()`。它決定哪個 Vue 頁面元件要渲染，不直接擁有瀏覽器網址列。

Web 端公開網址由瀏覽器 host 管理：收到導航要求後，驗證資料、呼叫 `history.pushState`、傳入新的 `host-state`。App 監看 page 和 id，再用 `router.replace` 同步內部路由。

內部同步使用繁中形式的路徑，並不表示語言被重設。語言存在共用狀態裡；此處的 Router 只需要選對頁面元件。

## 上一頁與重新整理走不同入口

按瀏覽器上一頁會觸發 `popstate`。host 從目前網址重新推導狀態，應用程式再跟著更新。

重新整理則是一個新的文件請求。伺服器必須把有效應用程式路徑送到主站 HTML，之後才由 host 讀取完整網址。只在首頁測試成功，不能證明深層網址重新整理也成功。

主站預覽工具以路徑形狀決定是否送出主站 HTML；未知 ID 的 HTTP 狀態與畫面的找不到內容提示，仍可能不相同。[建置與載入](build-and-hosting.md)會再說明這個邊界。

## 切換語言為什麼還在同一頁？

語言切換保留 page 和 id，只替換 locale。明確帶 `/en/` 或 `/ja/` 的網址優先；只有最初進入裸 `/` 時，Web host 才可能還原之前儲存的語言選擇。

這能讓分享英文作品頁的人，和收到連結的人看到相同語言。儲存只是偏好，不應覆蓋明確的網址意圖。

## 幕後文件為什麼要另外處理？

`/guide/` 預計屬於文件網站。它需要完整的文件頁面導航，不能直接呼叫目前只認得主站頁面種類的 `navigate()`。部署時也要讓文件靜態檔案先被處理，再套用主站的路由 fallback。

這個例子正好說明：一個側欄連結看起來很小，卻牽涉頁面身分、平台操作與伺服器路徑三層責任。
