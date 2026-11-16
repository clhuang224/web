import type { Platform, Project } from '../domain/site'

export const projects: Project[] = [
  {
    id: 'finding-the-bus',
    title: 'Finding the Bus',
    summary: {
      'zh-TW': '查詢台灣公車路線、附近站點與即時到站資訊。',
      en: 'Explore Taiwan’s bus routes, nearby stops, and live arrival information.',
      ja: '台湾のバス路線、近くの停留所、リアルタイムの到着情報を調べるアプリ。',
    },
    tags: ['React', 'TypeScript'],
    website: 'https://bus.lynns.me',
    source: 'https://github.com/clhuang224/bus',
  },
  {
    id: 'queener',
    title: 'Queener',
    summary: {
      'zh-TW': '結合區域規則與 N 皇后概念的邏輯解謎遊戲。',
      en: 'A logic puzzle inspired by N-Queens, with region-based rules.',
      ja: 'N クイーン問題と領域のルールを組み合わせた、ロジックパズル。',
    },
    tags: ['Vue', 'TypeScript'],
    website: 'https://queener.lynns.me',
    source: 'https://github.com/clhuang224/queener',
  },
  {
    id: 'pre-prompt',
    title: 'PrePrompt',
    summary: {
      'zh-TW': '送出文字給 LLM 前，先以可重用的對照規則替換敏感資訊。',
      en: 'Replace sensitive terms with reusable mappings before sending text to an LLM.',
      ja: 'LLM に文章を送る前に、再利用できる置換ルールで機密情報を置き換えるツール。',
    },
    tags: ['JavaScript', 'HTML'],
    website: 'https://pre-prompt.lynns.me',
    source: 'https://github.com/clhuang224/pre-prompt',
  },
]

export const platforms: Platform[] = [
  {
    id: 'github',
    label: 'GitHub',
    icon: 'github-line',
    url: 'https://github.com/clhuang224',
  },
  {
    id: 'soundcloud',
    label: 'SoundCloud',
    icon: 'soundcloud-line',
    url: 'https://soundcloud.lynns.me',
  },
  {
    id: 'crowdin',
    label: 'Crowdin',
    icon: 'translate-2',
    url: 'https://crowdin.lynns.me',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: 'linkedin-box-line',
    url: 'https://linkedin.lynns.me',
  },
]
