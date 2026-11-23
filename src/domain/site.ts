import type { MarkdownStory } from './markdown'

export const locales = ['zh-TW', 'en', 'ja'] as const
export type Locale = (typeof locales)[number]
export const listPages = [
  'home',
  'portfolio',
  'drawings',
  'about',
  'guide',
  'blog',
] as const
export type ListPage = (typeof listPages)[number]
export const detailPages = ['project', 'drawing', 'chapter', 'post'] as const
export type DetailPage = (typeof detailPages)[number]
export const pages = [...listPages, ...detailPages] as const
export type Page = ListPage | DetailPage

const sections: Record<Page, ListPage> = {
  home: 'home',
  portfolio: 'portfolio',
  project: 'portfolio',
  drawings: 'drawings',
  drawing: 'drawings',
  about: 'about',
  guide: 'guide',
  chapter: 'guide',
  blog: 'blog',
  post: 'blog',
}

export function sectionOf(page: Page): ListPage {
  return sections[page]
}

export type SiteRoute =
  { page: ListPage; id: null } | { page: DetailPage; id: string }
export type Localized<T> = Record<Locale, T>

export interface HostState {
  locale: Locale
  page: Page
  id: string | null
  compact: boolean
  reducedMotion: boolean
}

export interface Project {
  id: string
  title: string
  summary: Localized<string>
  tags: string[]
  website: string
  source: string
}

export interface Doodle {
  id: string
  number: number
  src: string
  story?: MarkdownStory
}

export interface Platform {
  id: string
  label: string
  icon: string
  url: string
}

export interface SiteHostModule {
  getState(input: null, callback: (state: HostState) => void): void
  navigate(
    input: { page: Page; id: string | null; locale: Locale },
    callback: () => void,
  ): void
  openExternal(input: { url: string }, callback: () => void): void
}
