import { defineConfig } from 'vitepress'

const chapter = (text: string, link: string) => ({ text, link: `/${link}` })
const home = { text: '回到 Lynn’s', link: '../', target: '_self' }

export default defineConfig({
  lang: 'zh-TW',
  title: 'Lynn’s 幕後',
  description: 'Lynn’s 個人網站的實作導覽與 VueLynx 教學。',
  srcDir: 'guide/zh-TW',
  base: '/guide/',
  outDir: '../dist/guide',
  cleanUrls: true,
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/images/brand/lynns-monogram.svg',
      },
    ],
  ],
  vite: { server: { host: '127.0.0.1', port: 3002, strictPort: true } },
  themeConfig: {
    logoLink: home,
    nav: [home],
    outline: { level: [2, 3], label: '本頁內容' },
    docFooter: { prev: '上一章', next: '下一章' },
    sidebarMenuLabel: '章節',
    returnToTopLabel: '回到頂端',
    darkModeSwitchLabel: '外觀',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜尋', buttonAriaLabel: '搜尋' },
          modal: {
            noResultsText: '找不到結果',
            resetButtonTitle: '清除',
            footer: {
              selectText: '選擇',
              navigateText: '移動',
              closeText: '關閉',
            },
          },
        },
        miniSearch: {
          searchOptions: { combineWith: 'AND' },
          options: {
            tokenize: (text: string) =>
              text.match(/[\p{Script=Han}]|[^\s\p{P}\p{Script=Han}]+/gu) ?? [],
          },
        },
      },
    },
    sidebar: [
      {
        text: '開始',
        items: [
          chapter('這個網站怎麼做的', ''),
          chapter('選一條閱讀路線', 'reading-map'),
          chapter('選擇與取捨', 'design-decisions'),
        ],
      },
      {
        text: '功能導覽',
        items: [
          chapter('從 Vue 到 Lynx', 'vue-to-lynx'),
          chapter('從下一張按鈕讀懂輪播', 'carousel'),
          chapter('平台能力怎麼接起來', 'runtime-bridge'),
          chapter('路由、網址與上一頁', 'routing'),
          chapter('三語內容與型別', 'content-and-i18n'),
          chapter('GitHub 資料怎麼進畫面', 'github-data'),
        ],
      },
      {
        text: '工程與維護',
        items: [
          chapter('樣式、UnoCSS 與圖檔', 'styling-and-assets'),
          chapter('建置、載入與部署', 'build-and-hosting'),
          chapter('測試與可及性', 'testing-and-accessibility'),
          chapter('內容維護練習', 'maintaining-content'),
          chapter('原生端探索', 'native-exploration'),
        ],
      },
      {
        text: '參考',
        items: [
          chapter('名詞對照', 'glossary'),
          chapter('原始碼地圖', 'source-map'),
        ],
      },
    ],
  },
})
