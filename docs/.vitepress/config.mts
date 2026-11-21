import { defineConfig } from 'vitepress'
import { guideSections } from '../../src/content/guide'

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
    sidebar: guideSections.map((section) => ({
      text: section.title,
      items: section.chapters.map((item) =>
        chapter(item.title, item.slug === 'index' ? '' : item.slug),
      ),
    })),
  },
})
