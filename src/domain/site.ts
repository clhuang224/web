import type { MarkdownStory } from './markdown'

export const locales = ['zh-TW', 'en', 'ja'] as const
export type Locale = (typeof locales)[number]
export const pages = [
  'home',
  'portfolio',
  'project',
  'drawings',
  'drawing',
  'about',
  'guide',
  'chapter',
  'blog',
  'post',
] as const
export type Page = (typeof pages)[number]
export const detailPages = ['project', 'drawing', 'chapter', 'post'] as const
export type DetailPage = (typeof detailPages)[number]
export type ListPage = Exclude<Page, DetailPage>

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
  alt: Localized<string>
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
  getRepository(input: { name: string }, callback: () => void): void
  openExternal(input: { url: string }, callback: () => void): void
}
