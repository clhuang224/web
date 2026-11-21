# 三語內容與型別

切換語言之後，按鈕和摘要要跟著換，不過正在看的作品還是同一件。這件事看起來很普通，放資料的時候卻滿容易把文案、網址和版型混在一起。

所以先從資料長什麼樣子開始看。

## 文案與作品資料放在哪裡？

| 檔案                      | 維護的內容                                   |
| ------------------------- | -------------------------------------------- |
| `src/content/copy.ts`     | 導覽、按鈕、提示等介面文案。                 |
| `src/content/projects.ts` | 作品名稱、摘要、標籤、正式網址和原始碼網址。 |
| `src/content/articles.ts` | 首頁精選文章的標題、摘要、日期和原文連結。   |
| `src/content/doodles.ts`  | 塗鴉 ID、圖檔路徑和各語言描述。              |

檔案連結見[原始碼地圖](source-map.md)。資料負責內容，頁面負責組合；因此調整摘要通常不需要修改整個卡片 template。

## `Localized<T>` 是什麼？

[site.ts](https://github.com/clhuang224/web/blob/main/src/domain/site.ts) 定義：

```ts
export type Localized<T> = Record<Locale, T>
```

`Locale` 是 `zh-TW`、`en`、`ja` 三種值。把它放進 `Record`，就表示每個語言鍵都要有對應的值；所以 `Localized<string>` 就是三個語言都要有字串。

這裡的 `T` 是泛型參數，可以理解成留給型別使用者填入的位置。`Record<Locale, T>` 指定鍵是哪些語言，值則使用填入的型別；當 `T` 是 `string`，每個語言的值就都必須是字串。

接著看作品的型別：

```ts
export interface Project {
  id: string
  title: string
  summary: Localized<string>
  tags: string[]
  website: string
  source: string
}
```

可以看到只有 `summary` 使用 `Localized<string>`。作品名稱、標籤和目的地仍然共用，這剛好把「要翻譯的介紹」和「介紹的是哪個作品」分開了。

`interface` 描述一個物件應有的欄位與型別，像是 `id` 必須是字串、`tags` 是字串陣列。這些宣告供 TypeScript 檢查程式，不會在執行時自動建立物件或驗證外部資料。

它可以在編譯時攔住缺少語言鍵的情況，但不能判斷翻譯是否自然、摘要是否忠於原文，也不保證字串不是空白。這些需要內容檢查與人工閱讀。

## 為什麼把網址放在翻譯外面？

作品的 `summary` 依語言分開，`website` 和 `source` 則由各語言共用。這表達了資料本身的規則：換語言是在介紹同一個作品。

畫面以 `project.summary[state.locale]` 選摘要，沒有把目的地邏輯藏進翻譯文字。若將來某個目的地真的有各語言版本，再明確調整資料模型。

## 介面文字怎麼跟著語言更新？

頁面常見這個模式：

```ts
const text = computed(() => copy[state.value.locale])
```

這行可以拆成兩個部分：`copy` 放全部文案，`state.locale` 決定目前讀哪一份。語言改變，computed 就重新選一次，template 繼續使用原本的欄位。

因此每個按鈕不用自己寫三個語言的判斷。要增加一個介面詞彙時，也比較容易回到同一個地方確認有沒有漏掉翻譯。

## 與 i18n library 比較

目前使用直接的物件查詢與型別化資源，適合固定介面文案和內容摘要。資料結構清楚，讀一個欄位就能找到對應文字，但替換參數、複數或格式化等規則需要另外處理。

另一種做法是使用 Vue I18n 這類工具，集中管理訊息與語言規則，例如它提供[複數處理](https://vue-i18n.intlify.dev/guide/essentials/pluralization)。它能涵蓋更複雜的翻譯需求，也會增加設定與整合成本。

本專案目前沒有採用 Vue I18n。這個比較說明兩種做法的責任差異；若需求擴大，還需要驗證所選工具與 VueLynx binding 的相容性，再決定是否替換現有資源。

## 文章、About 與教學各有不同邊界

精選文章在本站翻譯標題與摘要，完整原文仍然是中文。其他語言的卡片要讓讀者知道目的地語言，避免以為點開後也有整篇翻譯。

About 的個人內容由作者提供。版型與翻譯結構存在，不代表可以用推測補上個人經歷。

這份幕後指南先服務繁中讀者。主站三語和教學三語是不同的維護承諾；文件入口可以翻譯，但不能因此讓讀者誤以為所有章節已有英文或日文版本。

## 可以怎麼驗證？

[content.test.ts](https://github.com/clhuang224/web/blob/main/src/content/content.test.ts) 會比對介面鍵、檢查各語言內容非空、確認圖片清單與連結形狀。它沒有請求每篇文章確認內容，也不會評估翻譯品質。

實際檢查時，選一個作品詳情頁切換三語，確認頁面身分和 ID 保留、摘要更新、連結目的地一致，再讀一次文字是否合理。

下一步可以照[內容維護練習](maintaining-content.md)修改一個既有摘要，觀察資料與版型的分工。
