# 平台能力怎麼接起來

點一下作品卡，畫面就要換成作品詳情。這件事在元件裡很好表達，不過接著就會遇到一個問題：瀏覽器要改網址，Android Explorer 裡又沒有同一個網址列，那這段邏輯要放哪裡？

目前的做法，是先讓頁面使用共用操作，再由平台轉接決定怎麼完成。

這裡把提供執行容器與平台能力的一端稱為 host，應用程式與 host 傳遞操作、資料的介面則稱為 bridge。接下來會沿用這兩個名稱，完整對照放在[名詞頁](glossary.md)。

先讀 [src/platform/host.ts](https://github.com/clhuang224/web/blob/main/src/platform/host.ts)，再對照 [src/host/index.ts](https://github.com/clhuang224/web/blob/main/src/host/index.ts)。兩個 host 名稱相近，責任不同。

## 兩個 host 各做什麼？

| 檔案                   | 所在的位置      | 責任                                                                                                                                              |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/platform/host.ts` | Lynx 應用程式內 | 提供頁面使用的狀態與操作，選擇瀏覽器 bridge 或 standalone 路徑。                                                                                  |
| `src/host/index.ts`    | 瀏覽器外殼      | 建立 `lynx-view`，處理 bridge、History 和外部視窗；網址狀態、metadata 與 iframe 嵌入分別放在同資料夾的 `location.ts`、`metadata.ts`、`embed.ts`。 |

Web 端的操作可以沿著這條線追：

```text
元件 @tap
  → useSite().navigate(...)
  → NativeModules.SiteHost
  → site-host.mjs
  → 瀏覽器 handleRequest(...)
  → 更新網址並送出 host-state
  → useHost() 接收新狀態
```

這裡的 SiteHost 是專案自己定義的介面。名字看起來很像內建服務，不過它實際上是網站替自己準備的一組平台能力。

取得這組能力的入口在 [runtime.ts](https://github.com/clhuang224/web/blob/main/src/platform/runtime.ts)：

```ts
export function nativeHost() {
  return typeof NativeModules === 'undefined'
    ? undefined
    : NativeModules.SiteHost
}
```

先確認 `NativeModules` 存在，再取得裡面的 SiteHost。這段只負責取得介面；目前環境是不是原生 shell，另外由 `SystemInfo.platform` 判斷。兩個問題分開，才不會把「沒有這個模組」直接當成一種平台。

## 介面限制了能要求什麼

[SiteHostModule](https://github.com/clhuang224/web/blob/main/src/domain/site.ts) 列出 `getState`、`navigate` 和 `openExternal`。元件提出有意義的操作，不直接傳一段任意 JavaScript 給瀏覽器執行。

例如 `navigate` 傳送的是頁面種類、資料 ID 和語言。瀏覽器端再檢查資料格式、有效頁面和有效 ID，通過後才更新網址。

這裡還要多做一次資料檢查。雖然兩邊都用 TypeScript，訊息真的傳進來時，仍然只是 runtime 的值；頁面種類、ID 和語言都要符合預期，才繼續操作。

因此接收端先把值當成 `unknown`：資料可以進來，但還不能直接假設它有 `page` 或 `locale`。通過 `isHostState` 這類檢查後，TypeScript 才能把它縮小成已知的型別。這種搭配實際條件進行型別縮小的函式，稱為 type guard。

## 第一次狀態如何抵達？

`useHost()` 掛載後，先訂閱 `host-state` 和 `repository` 事件，再請求 `getState`。先建立接收管道，可以減少快速回應早於訂閱的問題。

瀏覽器收到 `getState`，把應用程式標成就緒、解除載入逾時，並回傳從網址與媒體查詢讀到的狀態。後續上一頁、視窗寬度或動態偏好改變，則再透過事件傳入。

`shallowRef` 是只追蹤最外層值替換的 ref，不會把物件內部的每一層都變成深層反應式資料。程式用 `state.value = { ...value }` 取代整份物件，讓使用它的 computed 和 watch 能追到新的狀態；只改深處的欄位，不能期待相同的更新方式。

## standalone 模式怎麼處理？

[runtime.ts](https://github.com/clhuang224/web/blob/main/src/platform/runtime.ts) 透過 `SystemInfo.platform` 判斷是否是原生 shell。這條路徑不依賴瀏覽器 host：導航和語言直接修改應用程式狀態，GitHub 資料直接請求。

外部連結則設定 `browserUrl`，由 [InAppBrowser](https://github.com/clhuang224/web/blob/main/src/components/InAppBrowser.vue) 顯示原生 webview。原生端的返回、尺寸變化和動態偏好仍要逐項測試；共用一組方法名稱不代表底層行為完全一致。

## 這個拆分帶來什麼價值？

讀到這裡，可以再看一次作品卡的 `navigate(...)`。它只需要交代要去哪裡，平台端再決定怎麼走。

另一種做法，是讓各個元件自行判斷平台並呼叫對應能力。元件很少時，這樣可以少一層包裝；操作分散到多個頁面後，平台分支和驗證規則也容易重複。

目前用共用介面集中這些差異，代價是需要維護介面與同步流程。局部計算仍直接留在應用程式內，例如輪播不需要每換一張就請 host 計算索引。

下一篇從[實際路由](routing.md)看瀏覽器與應用程式如何配合。
