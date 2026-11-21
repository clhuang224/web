# 路由、網址與上一頁

點 Queener 作品卡時，應用程式要知道「顯示作品詳情，ID 是 queener」。Web 端還要讓網址變成 `/portfolio/queener`，讓重新整理、分享和上一頁能理解同一個位置。

首先把頁面身分與公開網址分開，就比較容易理解這裡為什麼有兩層路由。

## 先認出頁面的身分

[site.ts](https://github.com/clhuang224/web/blob/main/src/domain/site.ts) 區分列表頁與詳情頁。詳情頁需要 ID；列表頁沒有 ID。`HostState` 再把語言、版面與減少動態效果狀態一起傳入。

`project` 是頁面種類，`queener` 是內容 ID，`portfolio` 是公開網址中的區段。它們不必用同一個字。

[catalog.ts](https://github.com/clhuang224/web/blob/main/src/content/catalog.ts) 從作品、塗鴉和幕後章節清單產生有效 ID。這讓路由驗證可以跟著內容清單更新，避免另外手抄一份 ID 表。

## 同一件作品可以有三種公開網址

| 語言     | 公開位置                |
| -------- | ----------------------- |
| 繁體中文 | `/portfolio/queener`    |
| 英文     | `/en/portfolio/queener` |
| 日文     | `/ja/portfolio/queener` |

[navigation.ts](https://github.com/clhuang224/web/blob/main/src/domain/navigation.ts) 的 `pathForPage` 產生路徑，`parseSitePath` 則把路徑還原成語言、頁面和 ID，並檢查是否匹配。

產生路徑的部分如下：

```ts
export function pathForPage(
  locale: Locale,
  page: Page,
  id: string | null = null,
): string {
  const prefix = locale === 'zh-TW' ? '' : `/${locale}`
  if (isDetailPage(page)) return `${prefix}/${detailSegments[page]}/${id}`
  return page === 'home' ? `${prefix}/` : `${prefix}/${listSegments[page]}`
}
```

先依語言選擇前綴。接著判斷是否是詳情頁，詳情頁會附上 ID；其餘頁面則由 `listSegments` 取得路徑。這個函式只產生字串，ID 是否存在，要交給路徑解析和內容清單驗證。

對外部輸入做解析時，合法的字串形狀和真的存在的作品是兩個問題。`/portfolio/missing` 看起來像詳情路徑，但若清單沒有這個 ID，就不應視為已找到內容。

## 為什麼裡面用 memory history？

[app/router.ts](https://github.com/clhuang224/web/blob/main/src/app/router.ts) 使用 `createMemoryHistory()`。它決定哪個 Vue 頁面元件要渲染，不直接擁有瀏覽器網址列。

Router 會把位置對應到頁面元件，history 則決定位置與歷程怎麼保存。Memory history 把狀態留在記憶體中；[官方說明](https://router.vuejs.org/guide/essentials/history-mode.html#memory-mode)指出，它本身不與瀏覽器 URL 互動。

Web 端公開網址由瀏覽器 host 管理：收到導航要求後，驗證資料、呼叫 `history.pushState`、傳入新的 `host-state`。App 監看 page 和 id，再用 `router.replace` 同步內部路由。

內部同步使用繁中形式的路徑，並不表示語言被重設。語言存在共用狀態裡；此處的 Router 只需要選對頁面元件。

一般 Vue Web 專案也可以用 `createWebHistory()`，直接讓 Router 管理瀏覽器位置。這樣網址與頁面由同一端負責；本專案則讓 host 處理瀏覽器能力，內部 Router 只負責選頁面，所以需要明確的同步流程。兩者適合的責任分配不同。

## 一個已確認的相容性問題

**現象：** 使用 Vue Router 5 時，路由切換曾出現 `getRootNode()` 相關錯誤。

**原因：** 該版本的處理會接觸瀏覽器 DOM 元素介面，而專案使用的 Lynx 元素沒有提供同樣的方法。

**處理方式：** 專案目前將 Vue Router 限定在 4.x。這個案例說明，能匯入套件與通過型別檢查，還需要配合實際 renderer 驗證。之後若升級，應重新檢查路由切換，而不只看建置結果。

## 上一頁與重新整理走不同入口

按瀏覽器上一頁會觸發 `popstate`。host 從目前網址重新推導狀態，應用程式再跟著更新。

重新整理則是一個新的文件請求。伺服器必須把有效應用程式路徑送到主站 HTML，之後才由 host 讀取完整網址。只在首頁測試成功，不能證明深層網址重新整理也成功。

主站預覽工具以路徑形狀決定是否送出主站 HTML；未知 ID 的 HTTP 狀態與畫面的找不到內容提示，仍可能不相同。[建置與載入](build-and-hosting.md)會再說明這個邊界。

## 切換語言為什麼還在同一頁？

語言切換保留 page 和 id，只替換 locale。明確帶 `/en/` 或 `/ja/` 的網址優先；只有最初進入裸 `/` 時，Web host 才可能還原之前儲存的語言選擇。

這能讓分享英文作品頁的人，和收到連結的人看到相同語言。儲存只是偏好，不應覆蓋明確的網址意圖。

## 幕後文件為什麼要另外處理？

現在側欄的幕後入口是 `/behind-the-scenes`，章節則使用 `/behind-the-scenes/<章節>`。這些也是主站頁面，因此閱讀時可以保留側欄。

文件本身由 VitePress 產生，放在 `/guide/`。Web host 會在 `EmbedPage` 的 `.embed-frame` 容器中放入同來源 iframe，載入對應章節。VitePress 切換章節後，再透過訊息把文件路徑交給 host，同步主站網址。

因此這裡有兩種位置：`/behind-the-scenes/...` 表達主站正在閱讀哪個章節，`/guide/...` 則提供文件內容。兩邊都需要正確的靜態檔案與重新整理處理。

## 網誌也使用嵌入頁，為什麼同步方式不同？

`EmbedPage` 同時承接網誌。`/blog` 顯示網誌首頁，文章則沿用原本的日期與路徑，例如 `/blog/2026/04/01/20260401-bus-tech-stack`。這裡的文章 ID 是網誌路徑，不是精選清單中的 `bus-tech-stack` 識別碼。

文章仍由 `https://blog.lynns.me` 提供，主站只保留側欄與閱讀位置。這是跨來源 iframe，瀏覽器 host 不能直接讀取裡面的網址，因此由網誌傳送 `blog-route` 訊息，同步目前路徑。

host 先確認訊息來自目前 iframe 和網誌來源，再更新外層網址。網誌目前只向正式主站 `https://lynns.me` 傳送訊息，所以本地開發不能直接證明這段同步正常。網誌路徑也不像作品 ID 那樣逐筆對照清單；路由接受合法的路徑區段，文章是否存在仍由網誌回應。

這個例子正好說明：一個側欄連結看起來很小，卻牽涉頁面身分、平台操作與伺服器路徑三層責任。
