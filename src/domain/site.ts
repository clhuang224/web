export const locales = ['zh-TW', 'en', 'ja'] as const
export type Locale = (typeof locales)[number]
export const pages = ['home', 'portfolio', 'about'] as const
export type Page = (typeof pages)[number]
export type Localized<T> = Record<Locale, T>

export interface HostState {
  locale: Locale
  page: Page
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
  src: string
  alt: Localized<string>
}

export interface Platform {
  id: string
  label: string
  icon: string
  url: string
}

export interface SiteHostModule {
  getState(input: null, callback: (state: HostState) => void): void
  navigate(input: { page: Page; locale: Locale }, callback: () => void): void
  openExternal(input: { url: string }, callback: () => void): void
}
