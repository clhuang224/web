# 原始碼地圖

下列連結指向 GitHub 的 main 分支，可以配合各章節打開完整檔案。文件檢查工具會比對本機的原始碼路徑與程式摘錄；若要回顧舊版實作，還需要在 repository 中切換對應版本。

## 畫面與應用程式

| 原始碼                                                                                              | 找什麼                                  |
| --------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [src/index.ts](https://github.com/clhuang224/web/blob/main/src/index.ts)                            | createApp、安裝 Router 和掛載。         |
| [src/App.vue](https://github.com/clhuang224/web/blob/main/src/App.vue)                              | 共用狀態、側欄、語言選擇與 RouterView。 |
| [src/app/context.ts](https://github.com/clhuang224/web/blob/main/src/app/context.ts)                | 型別化 provide/inject 與 useSite。      |
| [src/app/router.ts](https://github.com/clhuang224/web/blob/main/src/app/router.ts)                  | memory history 和頁面元件。             |
| [HomePage.vue](https://github.com/clhuang224/web/blob/main/src/pages/HomePage.vue)                  | 輪播、精選作品與文章的組合。            |
| [ProjectPage.vue](https://github.com/clhuang224/web/blob/main/src/pages/ProjectPage.vue)            | 作品資料、GitHub 資訊和外連。           |
| [DrawingPage.vue](https://github.com/clhuang224/web/blob/main/src/pages/DrawingPage.vue)            | 單張塗鴉與前後導航。                    |
| [DrawingsPage.vue](https://github.com/clhuang224/web/blob/main/src/pages/DrawingsPage.vue)          | 圖片式瀑布流列表與欄位切換。            |
| [EmbedPage.vue](https://github.com/clhuang224/web/blob/main/src/pages/EmbedPage.vue)                | 幕後與網誌的站內容器、原生 webview。    |
| [DoodleCarousel.vue](https://github.com/clhuang224/web/blob/main/src/components/DoodleCarousel.vue) | 播放狀態、計時器和可見圖片。            |
| [VectorImage.vue](https://github.com/clhuang224/web/blob/main/src/components/VectorImage.vue)       | SVG 的平台分支。                        |
| [DoodleImage.vue](https://github.com/clhuang224/web/blob/main/src/components/DoodleImage.vue)       | 縮圖佔位、原圖載入與狀態切換。          |
| [MarkdownBody.vue](https://github.com/clhuang224/web/blob/main/src/components/MarkdownBody.vue)     | Markdown 區塊與巢狀內容的 Lynx 呈現。   |
| [MarkdownInline.vue](https://github.com/clhuang224/web/blob/main/src/components/MarkdownInline.vue) | 粗斜體、行內程式碼與連結。              |
| [InAppBrowser.vue](https://github.com/clhuang224/web/blob/main/src/components/InAppBrowser.vue)     | 原生 webview 與關閉控制。               |

## 規則、資料與平台

| 原始碼                                                                                             | 找什麼                                |
| -------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [src/domain/site.ts](https://github.com/clhuang224/web/blob/main/src/domain/site.ts)               | 頁面、語言、內容和 bridge 型別。      |
| [src/domain/navigation.ts](https://github.com/clhuang224/web/blob/main/src/domain/navigation.ts)   | 路徑產生、解析和狀態驗證。            |
| [src/domain/carousel.ts](https://github.com/clhuang224/web/blob/main/src/domain/carousel.ts)       | 張數、換組與對齊。                    |
| [src/domain/repository.ts](https://github.com/clhuang224/web/blob/main/src/domain/repository.ts)   | GitHub 來源解析、回應驗證與請求。     |
| [src/content/catalog.ts](https://github.com/clhuang224/web/blob/main/src/content/catalog.ts)       | 從內容產生有效詳情 ID。               |
| [src/content/guide.ts](https://github.com/clhuang224/web/blob/main/src/content/guide.ts)           | 幕後章節順序、標題與文件路徑。        |
| [src/content/copy.ts](https://github.com/clhuang224/web/blob/main/src/content/copy.ts)             | 三語介面文案。                        |
| [src/content/tags.ts](https://github.com/clhuang224/web/blob/main/src/content/tags.ts)             | 技術標籤的顏色對照與預設值。          |
| [src/content/projects.ts](https://github.com/clhuang224/web/blob/main/src/content/projects.ts)     | 作品與平台目的地。                    |
| [src/content/articles.ts](https://github.com/clhuang224/web/blob/main/src/content/articles.ts)     | 精選文章、網誌路徑與網址轉換。        |
| [src/content/doodles.ts](https://github.com/clhuang224/web/blob/main/src/content/doodles.ts)       | 塗鴉清單與圖檔路徑。                  |
| [src/platform/host.ts](https://github.com/clhuang224/web/blob/main/src/platform/host.ts)           | 狀態訂閱、操作和 standalone 路徑。    |
| [src/platform/runtime.ts](https://github.com/clhuang224/web/blob/main/src/platform/runtime.ts)     | 平台判斷與資源前綴。                  |
| [src/host/index.ts](https://github.com/clhuang224/web/blob/main/src/host/index.ts)                 | 建立 `lynx-view`、bridge 與載入狀態。 |
| [src/host/location.ts](https://github.com/clhuang224/web/blob/main/src/host/location.ts)           | 從網址讀狀態、記住語言。              |
| [src/host/metadata.ts](https://github.com/clhuang224/web/blob/main/src/host/metadata.ts)           | 分頁標題與 meta 標籤。                |
| [src/host/embed.ts](https://github.com/clhuang224/web/blob/main/src/host/embed.ts)                 | 網誌與幕後的 iframe 嵌入。            |
| [src/host/site-host.mjs](https://github.com/clhuang224/web/blob/main/src/host/site-host.mjs)       | NativeModule 呼叫的轉送。             |
| [src/host/accessibility.ts](https://github.com/clhuang224/web/blob/main/src/host/accessibility.ts) | Web 的語意與鍵盤轉接。                |

## 建置、樣式與檢查

| 原始碼                                                                                                             | 找什麼                                  |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| [package.json](https://github.com/clhuang224/web/blob/main/package.json)                                           | 實際存在的 scripts 和依賴。             |
| [lynx.config.ts](https://github.com/clhuang224/web/blob/main/lynx.config.ts)                                       | Lynx/Web 目標與 CSS 支援設定。          |
| [rsbuild.host.config.ts](https://github.com/clhuang224/web/blob/main/rsbuild.host.config.ts)                       | 瀏覽器入口、代理與靜態資產複製。        |
| [uno.config.ts](https://github.com/clhuang224/web/blob/main/uno.config.ts)                                         | Utility CSS 的掃描和 preset。           |
| [src/styles/site.css](https://github.com/clhuang224/web/blob/main/src/styles/site.css)                             | 元件樣式與語意色彩。                    |
| [scripts/dev.mjs](https://github.com/clhuang224/web/blob/main/scripts/dev.mjs)                                     | 多個開發程序的啟停。                    |
| [scripts/preview.mjs](https://github.com/clhuang224/web/blob/main/scripts/preview.mjs)                             | 靜態預覽、路徑和 MIME。                 |
| [scripts/verify-build.mjs](https://github.com/clhuang224/web/blob/main/scripts/verify-build.mjs)                   | 必要輸出檢查。                          |
| [scripts/generate-placeholders.mjs](https://github.com/clhuang224/web/blob/main/scripts/generate-placeholders.mjs) | 從原始塗鴉產生獨立縮圖資料。            |
| [scripts/generate-content.mjs](https://github.com/clhuang224/web/blob/main/scripts/generate-content.mjs)           | 原創 Markdown 來源與產生內容的整合。    |
| [scripts/lib/markdown-content.mjs](https://github.com/clhuang224/web/blob/main/scripts/lib/markdown-content.mjs)   | Frontmatter、Markdown 區塊及日期解析。  |
| [scripts/prepare-pages.mjs](https://github.com/clhuang224/web/blob/main/scripts/prepare-pages.mjs)                 | GitHub Pages 的頁面副本、404 與 CNAME。 |
| [docs/.vitepress/config.mts](https://github.com/clhuang224/web/blob/main/docs/.vitepress/config.mts)               | 文件來源、章節導覽、搜尋和輸出位置。    |
| [carousel.test.ts](https://github.com/clhuang224/web/blob/main/src/domain/carousel.test.ts)                        | 一輪換組、前後與版面對齊。              |
| [navigation.test.ts](https://github.com/clhuang224/web/blob/main/src/domain/navigation.test.ts)                    | 路徑與狀態條件。                        |
| [repository.test.ts](https://github.com/clhuang224/web/blob/main/src/domain/repository.test.ts)                    | 外部資料解析案例。                      |
| [content.test.ts](https://github.com/clhuang224/web/blob/main/src/content/content.test.ts)                         | 翻譯鍵、清單和素材條件。                |
| [.github/workflows/ci.yml](https://github.com/clhuang224/web/blob/main/.github/workflows/ci.yml)                   | 主站 CI 執行哪些檢查。                  |

## 維護文件

- [README](https://github.com/clhuang224/web/blob/main/README.md)：目前狀態、設定與命令。
- [Architecture](https://github.com/clhuang224/web/blob/main/docs/architecture.md)：已實作的結構和邊界。
- [Plan](https://github.com/clhuang224/web/blob/main/docs/plan.md)：方向、取捨與未完成項目。
- [Assets](https://github.com/clhuang224/web/blob/main/docs/assets.md)：來源、檔名映射與順序。

指南負責帶讀與學習路線；上述文件各自維護自己的事實。實作更新時，應一起核對兩邊，避免舊說明看起來仍然合理卻已不符合程式。
