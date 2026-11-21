export interface GuideChapter {
  slug: string
  title: string
}

export interface GuideSection {
  title: string
  chapters: readonly GuideChapter[]
}

export const guideSections: readonly GuideSection[] = [
  {
    title: '開始',
    chapters: [
      { slug: 'index', title: '這個網站怎麼做的' },
      { slug: 'reading-map', title: '選一條閱讀路線' },
      { slug: 'design-decisions', title: '選擇與取捨' },
    ],
  },
  {
    title: '功能導覽',
    chapters: [
      { slug: 'vue-to-lynx', title: '從 Vue 到 Lynx' },
      { slug: 'carousel', title: '從下一張按鈕讀懂輪播' },
      { slug: 'runtime-bridge', title: '平台能力怎麼接起來' },
      { slug: 'routing', title: '路由、網址與上一頁' },
      { slug: 'content-and-i18n', title: '三語內容與型別' },
      { slug: 'github-data', title: 'GitHub 資料怎麼進畫面' },
    ],
  },
  {
    title: '工程與維護',
    chapters: [
      { slug: 'styling-and-assets', title: '樣式、UnoCSS 與圖檔' },
      { slug: 'build-and-hosting', title: '建置、載入與部署' },
      { slug: 'testing-and-accessibility', title: '測試與可及性' },
      { slug: 'maintaining-content', title: '內容維護練習' },
      { slug: 'native-exploration', title: '原生端探索' },
    ],
  },
  {
    title: '實驗',
    chapters: [{ slug: 'experiments', title: '延伸實驗與驗證' }],
  },
  {
    title: '參考',
    chapters: [
      { slug: 'glossary', title: '名詞對照' },
      { slug: 'source-map', title: '原始碼地圖' },
    ],
  },
]

export const guideChapters = guideSections
  .flatMap((section) => section.chapters)
  .filter((chapter) => chapter.slug !== 'index')

export function guidePath(chapter: string | null) {
  return chapter ? `/guide/${chapter}` : '/guide/'
}

export function chapterFromGuidePath(pathname: string): string | null {
  const slug = pathname
    .replace(/^\/guide\/?/, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '')
  return guideChapters.some((chapter) => chapter.slug === slug) ? slug : null
}
