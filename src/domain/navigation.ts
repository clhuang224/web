import { locales, pages } from './site'
import type { HostState, Locale, Page } from './site'

export interface SiteLocation {
  locale: Locale
  page: Page
  matched: boolean
}

export function isLocale(value: unknown): value is Locale {
  return locales.some((locale) => locale === value)
}

export function isPage(value: unknown): value is Page {
  return pages.some((page) => page === value)
}

export function isHostState(value: unknown): value is HostState {
  if (typeof value !== 'object' || value === null) return false
  return (
    'locale' in value &&
    isLocale(value.locale) &&
    'page' in value &&
    isPage(value.page) &&
    'compact' in value &&
    typeof value.compact === 'boolean' &&
    'reducedMotion' in value &&
    typeof value.reducedMotion === 'boolean'
  )
}

export function parseSitePath(pathname: string): SiteLocation {
  const segments = pathname.replace(/^\//, '').replace(/\/$/, '').split('/')
  const locale =
    segments[0] === 'en' || segments[0] === 'ja' ? segments.shift() : 'zh-TW'
  if (segments.length === 0) segments.push('')
  const pageSegment = segments[0] || 'home'
  const matched =
    pathname.startsWith('/') &&
    segments.length === 1 &&
    (pageSegment === 'home' ? segments[0] === '' : isPage(pageSegment))

  return {
    locale: isLocale(locale) ? locale : 'zh-TW',
    page: isPage(pageSegment) ? pageSegment : 'home',
    matched,
  }
}

export function pathForPage(locale: Locale, page: Page): string {
  const prefix = locale === 'zh-TW' ? '' : `/${locale}`
  return page === 'home' ? `${prefix}/` : `${prefix}/${page}`
}

export function isSafeExternalUrl(value: unknown): value is string {
  if (
    typeof value !== 'string' ||
    [...value].some((character) => character.charCodeAt(0) <= 32)
  )
    return false
  try {
    const url = new URL(value)
    return (
      (url.protocol === 'https:' && Boolean(url.hostname)) ||
      (url.protocol === 'mailto:' && Boolean(url.pathname))
    )
  } catch {
    return false
  }
}
