import type { Localized } from '../domain/site'

interface SiteCopy {
  home: string
  portfolio: string
  about: string
  blog: string
  eyebrow: string
  greeting: string
  introduction: string
  projectsTitle: string
  projectsIntro: string
  allProjects: string
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
}

export const copy = {
  'zh-TW': {
    home: '首頁',
    portfolio: '作品',
    about: '關於',
    blog: '網誌',
    eyebrow: '程式、塗鴉，還有一些小實驗',
    greeting: '嗨，我是 Lynn。',
    introduction: '前端工程師。喜歡把點子，慢慢做成看得見的東西。',
    projectsTitle: '精選作品',
    projectsIntro: '一些動手做出來的小世界。',
    allProjects: '所有作品',
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
  },
  en: {
    home: 'Home',
    portfolio: 'Portfolio',
    about: 'About',
    blog: 'Blog',
    eyebrow: 'CODE, DOODLES & LITTLE EXPERIMENTS',
    greeting: 'Hi, I’m Lynn.',
    introduction:
      'A frontend engineer turning little ideas into things you can see and use.',
    projectsTitle: 'Selected projects',
    projectsIntro: 'A few little worlds I’ve built.',
    allProjects: 'All projects',
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
  },
  ja: {
    home: 'ホーム',
    portfolio: '作品',
    about: '紹介',
    blog: 'ブログ',
    eyebrow: 'コード、落書き、ちょっとした実験',
    greeting: 'こんにちは、Lynn です。',
    introduction:
      'フロントエンドエンジニアです。小さなアイデアを、見て使える形にしています。',
    projectsTitle: 'ピックアップ',
    projectsIntro: '自分の手でつくった、小さな世界たち。',
    allProjects: 'すべての作品',
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
  },
} satisfies Localized<SiteCopy>
