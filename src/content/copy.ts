import type { Localized } from '../domain/site'

interface SiteCopy {
  home: string
  portfolio: string
  about: string
  guide: string
  navigation: string
  guideLanguage: string
  blog: string
  greeting: string
  introduction: string
  projectsTitle: string
  projectsIntro: string
  openProject: string
  source: string
  readBlog: string
  platformTitle: string
  pause: string
  play: string
  previous: string
  next: string
  carousel: string
  language: string
  madeWith: string
  drawings: string
  drawingsIntro: string
  drawingLabel: string
  backToPortfolio: string
  backToDrawings: string
  previousDrawing: string
  nextDrawing: string
  repositoryLanguage: string
  repositoryStars: string
  repositoryUpdated: string
  showMore: string
  closePage: string
  postsTitle: string
  articleLanguage: string
  aboutLanguage: string
  originalChinese: string
  copyright: string
  siteDescription: string
  pageNotFound: string
  loadError: string
}

export const copy = {
  'zh-TW': {
    home: '首頁',
    portfolio: '作品',
    about: '關於',
    guide: '幕後',
    navigation: '主要導覽',
    guideLanguage: '繁體中文教學',
    blog: '網誌',
    greeting: '嗨，我是 Lynn。',
    introduction: '前端工程師。喜歡把點子，慢慢做成看得見的東西。',
    projectsTitle: '精選作品',
    projectsIntro: '一些動手做出來的小世界。',
    openProject: '開啟作品',
    source: '原始碼',
    readBlog: '到網誌逛逛',
    platformTitle: '在這些地方找到我',
    pause: '暫停',
    play: '播放',
    previous: '上一組',
    next: '下一組',
    carousel: '塗鴉輪播',
    language: '語言',
    madeWith: '以 VueLynx 製作',
    drawings: '塗鴉',
    drawingsIntro: '2016–2023 年間畫的臉書封面塗鴉。',
    drawingLabel: '塗鴉',
    backToPortfolio: '回到作品',
    backToDrawings: '回到塗鴉',
    previousDrawing: '上一張',
    nextDrawing: '下一張',
    repositoryLanguage: '主要語言',
    repositoryStars: '星星',
    repositoryUpdated: '最後更新',
    showMore: '看更多',
    closePage: '關閉',
    postsTitle: '精選文章',
    articleLanguage: '中文文章',
    aboutLanguage: '中文原文',
    originalChinese: '中文原文',
    copyright: 'Copyright © Lynn Huang',
    siteDescription: "Lynn's 的作品、文章與創作入口。",
    pageNotFound: '找不到這個頁面。您可以從首頁繼續瀏覽。',
    loadError: '網站暫時無法載入。您仍可以閱讀網誌，或重新整理後再試。',
  },
  en: {
    home: 'Home',
    portfolio: 'Portfolio',
    about: 'About',
    guide: 'Behind the scenes',
    navigation: 'Main navigation',
    guideLanguage: 'Guide in Traditional Chinese',
    blog: 'Blog',
    greeting: 'Hi, I’m Lynn.',
    introduction:
      'A frontend engineer turning little ideas into things you can see and use.',
    projectsTitle: 'Selected projects',
    projectsIntro: 'A few little worlds I’ve built.',
    openProject: 'Open project',
    source: 'Source',
    readBlog: 'Visit the blog',
    platformTitle: 'Find me around the web',
    pause: 'Pause',
    play: 'Play',
    previous: 'Previous',
    next: 'Next',
    carousel: 'Doodle carousel',
    language: 'Language',
    madeWith: 'Made with VueLynx',
    drawings: 'Drawings',
    drawingsIntro: 'Doodles drawn as Facebook covers between 2016 and 2023.',
    drawingLabel: 'Drawing',
    backToPortfolio: 'Back to portfolio',
    backToDrawings: 'Back to drawings',
    previousDrawing: 'Previous drawing',
    nextDrawing: 'Next drawing',
    repositoryLanguage: 'Main language',
    repositoryStars: 'Stars',
    repositoryUpdated: 'Last updated',
    showMore: 'Show more',
    closePage: 'Close',
    postsTitle: 'Selected posts',
    articleLanguage: 'Article in Chinese',
    aboutLanguage: 'Written in Chinese',
    originalChinese: 'Written in Chinese',
    copyright: 'Copyright © Lynn Huang',
    siteDescription: 'Projects, selected writing, and creative work by Lynn.',
    pageNotFound:
      'This page could not be found. You can continue from the homepage.',
    loadError:
      'The site could not load. You can still read the blog, or refresh to try again.',
  },
  ja: {
    home: 'ホーム',
    portfolio: '作品',
    about: '紹介',
    guide: '舞台裏',
    navigation: 'メインナビゲーション',
    guideLanguage: '繁体字中国語のガイド',
    blog: 'ブログ',
    greeting: 'こんにちは、Lynn です。',
    introduction:
      'フロントエンドエンジニアです。小さなアイデアを、見て使える形にしています。',
    projectsTitle: 'ピックアップ',
    projectsIntro: '自分の手でつくった、小さな世界たち。',
    openProject: '作品を開く',
    source: 'ソースコード',
    readBlog: 'ブログへ',
    platformTitle: 'ほかの場所でも',
    pause: '一時停止',
    play: '再生',
    previous: '前へ',
    next: '次へ',
    carousel: '落書きのスライドショー',
    language: '言語',
    madeWith: 'VueLynx で制作',
    drawings: '落書き',
    drawingsIntro: '2016〜2023 年に Facebook のカバー画像として描いた落書き。',
    drawingLabel: '落書き',
    backToPortfolio: '作品一覧へ',
    backToDrawings: '落書き一覧へ',
    previousDrawing: '前の落書き',
    nextDrawing: '次の落書き',
    repositoryLanguage: '主な言語',
    repositoryStars: 'スター',
    repositoryUpdated: '最終更新',
    showMore: 'もっと見る',
    closePage: '閉じる',
    postsTitle: 'ピックアップ記事',
    articleLanguage: '中国語の記事',
    aboutLanguage: '中国語の原文',
    originalChinese: '中国語の原文',
    copyright: 'Copyright © Lynn Huang',
    siteDescription: 'Lynn の作品、記事、創作活動を紹介するサイト。',
    pageNotFound: 'ページが見つかりません。ホームからご覧ください。',
    loadError:
      'サイトを読み込めませんでした。ブログをご覧いただくか、再読み込みしてください。',
  },
} satisfies Localized<SiteCopy>
