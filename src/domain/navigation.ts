import { detailPages, locales, pages } from './site'
import type { DetailPage, HostState, ListPage, Locale, Page } from './site'

export interface SiteLocation {
  locale: Locale
  page: Page
  id: string | null
  matched: boolean
}

export type RouteCatalog = Record<DetailPage, readonly string[]>

const listSegments: Record<ListPage, string> = {
  home: '',
  portfolio: 'portfolio',
  drawings: 'drawings',
  about: 'about',
}

const detailSegments: Record<DetailPage, string> = {
  project: 'portfolio',
  drawing: 'drawing',
}

export function isLocale(value: unknown): value is Locale {
  return locales.some((locale) => locale === value)
}

export function isPage(value: unknown): value is Page {
  return pages.some((page) => page === value)
}

export function isDetailPage(value: unknown): value is DetailPage {
  return detailPages.some((page) => page === value)
}

export function isRouteId(page: Page, id: unknown): id is string | null {
  return isDetailPage(page)
    ? typeof id === 'string' && id.length > 0
    : id === null
}

export function isHostState(value: unknown): value is HostState {
  if (typeof value !== 'object' || value === null) return false
  return (
    'locale' in value &&
    isLocale(value.locale) &&
    'page' in value &&
    isPage(value.page) &&
    'id' in value &&
    isRouteId(value.page, value.id) &&
    'compact' in value &&
    typeof value.compact === 'boolean' &&
    'reducedMotion' in value &&
    typeof value.reducedMotion === 'boolean'
  )
}

function findListPage(segment: string): ListPage | undefined {
  return (Object.keys(listSegments) as ListPage[]).find(
    (page) => page !== 'home' && listSegments[page] === segment,
  )
}

function findDetailPage(
  segment: string,
  id: string,
  catalog: RouteCatalog,
): DetailPage | undefined {
  return detailPages.find(
    (page) => detailSegments[page] === segment && catalog[page].includes(id),
  )
}

export function parseSitePath(
  pathname: string,
  catalog: RouteCatalog,
): SiteLocation {
  const segments = pathname.replace(/^\//, '').replace(/\/$/, '').split('/')
  const locale =
    segments[0] === 'en' || segments[0] === 'ja' ? segments.shift() : 'zh-TW'
  const base = {
    locale: isLocale(locale) ? locale : 'zh-TW',
    page: 'home',
    id: null,
  } as const
  if (!pathname.startsWith('/')) return { ...base, matched: false }

  if (segments.length === 0 || (segments.length === 1 && segments[0] === ''))
    return { ...base, matched: true }

  if (segments.length === 1) {
    const page = findListPage(segments[0])
    return page ? { ...base, page, matched: true } : { ...base, matched: false }
  }

  if (segments.length === 2) {
    const [segment, id] = segments
    const page = findDetailPage(segment, id, catalog)
    if (page) return { ...base, page, id, matched: true }
  }

  return { ...base, matched: false }
}

export function pathForPage(
  locale: Locale,
  page: Page,
  id: string | null = null,
): string {
  const prefix = locale === 'zh-TW' ? '' : `/${locale}`
  if (isDetailPage(page)) return `${prefix}/${detailSegments[page]}/${id}`
  return page === 'home' ? `${prefix}/` : `${prefix}/${listSegments[page]}`
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
