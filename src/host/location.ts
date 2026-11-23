import { routeCatalog } from '../content/catalog'
import { isLocale, parseSitePath, pathForPage } from '../domain/navigation'
import type { HostState, Locale } from '../domain/site'

const localeStorageKey = 'lynns.locale'
export const compactQuery = window.matchMedia('(max-width: 767px)')
export const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

export function currentLocation() {
  return parseSitePath(window.location.pathname, routeCatalog)
}

export function stateFromLocation(): HostState {
  const location = currentLocation()
  return {
    locale: location.locale,
    page: location.page,
    id: location.id,
    compact: compactQuery.matches,
    reducedMotion: motionQuery.matches,
  }
}

export function rememberLocale(locale: Locale) {
  try {
    window.localStorage.setItem(localeStorageKey, locale)
  } catch {
    // Storage may be unavailable; explicit language URLs remain functional.
  }
}

export function restoreInitialLocale() {
  if (window.location.pathname !== '/') return
  try {
    const stored = window.localStorage.getItem(localeStorageKey)
    if (isLocale(stored) && stored !== 'zh-TW') {
      window.history.replaceState(null, '', pathForPage(stored, 'home'))
    }
  } catch {
    // The default language does not depend on browser storage.
  }
}
