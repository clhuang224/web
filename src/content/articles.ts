import type { Localized } from '../domain/site'

export interface SelectedArticle {
  id: string
  title: Localized<string>
  summary: Localized<string>
  date: string
  tags: readonly string[]
  url: string
  language: 'zh-TW'
}

export const selectedArticles: SelectedArticle[] = [
  {
    id: 'bus-tech-stack',
    title: {
      'zh-TW': 'Finding the bus 技術選擇',
      en: 'Choosing the tech stack for Finding the Bus',
      ja: 'Finding the Bus の技術選定',
    },
    summary: {
      'zh-TW':
        '回顧公車查詢專案一開始的規劃：題目怎麼選，以及資料與技術上的考量。',
      en: 'How the bus-finder project was planned: choosing the topic and weighing data and technology options.',
      ja: 'バス検索プロジェクトの初期計画：テーマの選び方と、データや技術の検討。',
    },
    date: '2026-04-02',
    tags: ['React', 'Redux Toolkit'],
    url: 'https://blog.lynns.me/2026/04/01/20260401-bus-tech-stack/',
    language: 'zh-TW',
  },
  {
    id: 'pre-prompt',
    title: {
      'zh-TW': 'PrePrompt 開發日記',
      en: 'PrePrompt development diary',
      ja: 'PrePrompt 開発日記',
    },
    summary: {
      'zh-TW':
        '從過濾敏感資訊的 shell script，到能在手機上使用的 PrePrompt 第一版。',
      en: 'From a shell script that filtered sensitive terms to the first version of PrePrompt that also works on a phone.',
      ja: '機密情報を置き換える shell script から、スマホでも使える PrePrompt 初版まで。',
    },
    date: '2026-03-16',
    tags: ['JavaScript'],
    url: 'https://blog.lynns.me/2026/03/16/20260316-create-pre-prompt/',
    language: 'zh-TW',
  },
  {
    id: 'daily-note',
    title: {
      'zh-TW': 'Daily Note 工作日誌習慣',
      en: 'A daily work-log habit',
      ja: 'Daily Note：毎日の作業記録',
    },
    summary: {
      'zh-TW': '用 Notion Database 每天記錄工作內容的習慣與欄位設計。',
      en: 'Keeping a daily work log in a Notion database, and how its fields are set up.',
      ja: 'Notion のデータベースで毎日の仕事を記録する習慣と、その項目設計。',
    },
    date: '2026-02-04',
    tags: ['Notion'],
    url: 'https://blog.lynns.me/2026/02/03/20260203-daily-note/',
    language: 'zh-TW',
  },
  {
    id: 'jsdc-2025',
    title: {
      'zh-TW': 'JSDC 2025 參與心得',
      en: 'Notes from JSDC 2025',
      ja: 'JSDC 2025 参加レポート',
    },
    summary: {
      'zh-TW': '參加 JSDC 2025 的紀錄，包含 Vite、Vue、AI 與 Signals 等議程。',
      en: 'Notes from attending JSDC 2025, covering talks on Vite, Vue, AI, and Signals.',
      ja: 'JSDC 2025 の参加記録。Vite、Vue、AI、Signals などのセッションについて。',
    },
    date: '2025-12-03',
    tags: ['JavaScript', 'Vite'],
    url: 'https://blog.lynns.me/2025/12/03/20251203-jsdc/',
    language: 'zh-TW',
  },
]

export const blogOrigin = 'https://blog.lynns.me'

export function blogPath(url: string) {
  return url.replace(blogOrigin, '').replace(/^\/+|\/+$/g, '')
}

export function blogUrl(path: string | null) {
  return path ? `${blogOrigin}/${path}/` : `${blogOrigin}/`
}

export function articleAt(path: string | null) {
  return selectedArticles.find((article) => blogPath(article.url) === path)
}
