import '@lynx-js/web-core/client'
import type { LynxViewElement } from '@lynx-js/web-core/client'
import { articleAt, blogOrigin, blogPath, blogUrl } from '../content/articles'
import { routeCatalog } from '../content/catalog'
import { copy } from '../content/copy'
import {
  chapterFromGuidePath,
  guideChapters,
  guidePath,
} from '../content/guide'
import { projects } from '../content/projects'
import {
  isLocale,
  isPage,
  isRouteId,
  isSafeExternalUrl,
  parseSitePath,
  pathForPage,
} from '../domain/navigation'
import type { HostState, Locale } from '../domain/site'
import { enableLynxAccessibility } from './accessibility'
import './host.css'
import './loader.css'
import loaderStyles from './loader.css?raw'

const localeStorageKey = 'lynns.locale'
const compactQuery = window.matchMedia('(max-width: 767px)')
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
const root = document.querySelector<HTMLElement>('#site-root')
const status = document.querySelector<HTMLElement>('#host-status')
const message = document.querySelector<HTMLElement>('#host-message')

if (!root || !status || !message)
  throw new Error('The site host document is incomplete.')

const hostRoot = root
const hostStatus = status
const hostMessage = message
const view = document.createElement('lynx-view') as LynxViewElement
let ready = false
let stopAccessibility: (() => void) | undefined

function rememberLocale(locale: Locale) {
  try {
    window.localStorage.setItem(localeStorageKey, locale)
  } catch {
    // Storage may be unavailable; explicit language URLs remain functional.
  }
}

function restoreInitialLocale() {
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

function stateFromLocation(): HostState {
  const location = parseSitePath(window.location.pathname, routeCatalog)
  return {
    locale: location.locale,
    page: location.page,
    id: location.id,
    compact: compactQuery.matches,
    reducedMotion: motionQuery.matches,
  }
}

function showError() {
  const state = stateFromLocation()
  hostMessage.textContent = copy[state.locale].loadError
  hostStatus.classList.remove('host-status-loading')
  hostStatus.hidden = false
  hostRoot.hidden = true
}

function pageTitle(state: HostState): string {
  const text = copy[state.locale]
  if (state.page === 'project')
    return (
      projects.find((project) => project.id === state.id)?.title ??
      text.portfolio
    )
  if (state.page === 'drawing') return `${text.drawingLabel} ${state.id ?? ''}`
  if (state.page === 'post')
    return articleAt(state.id)?.title[state.locale] ?? text.blog
  if (state.page === 'chapter')
    return (
      guideChapters.find((chapter) => chapter.slug === state.id)?.title ??
      text.guide
    )
  return text[state.page]
}

function updateMetadata(state: HostState) {
  const location = parseSitePath(window.location.pathname, routeCatalog)
  const text = copy[state.locale]
  const title = `${pageTitle(state)} · Lynn's`
  document.documentElement.lang = state.locale
  document.documentElement.dataset.routeStatus = location.matched
    ? 'found'
    : 'not-found'
  document.title = title
  document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.setAttribute('content', text.siteDescription)
  document
    .querySelector<HTMLMetaElement>('meta[property="og:title"]')
    ?.setAttribute('content', title)
  document
    .querySelector<HTMLMetaElement>('meta[property="og:description"]')
    ?.setAttribute('content', text.siteDescription)

  if (!location.matched) {
    hostMessage.textContent = text.pageNotFound
    hostStatus.classList.remove('host-status-loading')
    hostStatus.hidden = false
  } else if (ready) {
    hostStatus.hidden = true
  }
}

function sendState() {
  const state = stateFromLocation()
  updateMetadata(state)
  if (ready) view.sendGlobalEvent('host-state', [{ ...state }])
}

let embedFrame: HTMLIFrameElement | undefined

function embedLoader() {
  const shadow = view.shadowRoot
  if (shadow && !shadow.querySelector('style[data-loader]')) {
    const style = document.createElement('style')
    style.dataset.loader = ''
    style.textContent = loaderStyles
    shadow.append(style)
  }
  const overlay = document.createElement('div')
  overlay.className = 'embed-loader'
  const loader = document.createElement('span')
  loader.className = 'site-loader'
  loader.setAttribute('aria-hidden', 'true')
  for (let index = 0; index < 3; index += 1) {
    const dot = document.createElement('span')
    dot.className = 'site-loader-dot'
    loader.append(dot)
  }
  overlay.append(loader)
  return overlay
}

function embedSource(slot: HTMLElement, state: HostState) {
  if (slot.classList.contains('embed-blog'))
    return blogUrl(state.page === 'post' ? state.id : null)
  return guidePath(state.page === 'chapter' ? state.id : null)
}

function placeEmbed() {
  const slot = view.shadowRoot?.querySelector<HTMLElement>('.embed-frame')
  if (!slot) {
    embedFrame = undefined
    return
  }
  const state = stateFromLocation()
  const source = embedSource(slot, state)
  const key = slot.classList.contains('embed-blog') ? source : 'guide'
  if (embedFrame && slot.contains(embedFrame) && embedFrame.dataset.key === key)
    return
  embedFrame?.remove()
  slot.querySelector('.embed-loader')?.remove()
  const loader = embedLoader()
  const frame = document.createElement('iframe')
  frame.className = 'embedded-page'
  frame.dataset.key = key
  frame.title =
    copy[state.locale][slot.classList.contains('embed-blog') ? 'blog' : 'guide']
  frame.src = source
  frame.style.cssText = 'flex:1;width:100%;height:100%;border:0;display:block'
  frame.addEventListener('load', () => loader.remove(), { once: true })
  slot.append(frame, loader)
  embedFrame = frame
}

function routeMessage(data: unknown, type: string) {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('type' in data) ||
    data.type !== type ||
    !('path' in data) ||
    typeof data.path !== 'string'
  )
    return null
  return data.path
}

function replaceEmbeddedPath(path: string) {
  if (window.location.pathname === path) return
  window.history.replaceState(null, '', path)
  sendState()
}

function followEmbed(event: MessageEvent) {
  if (!embedFrame || event.source !== embedFrame.contentWindow) return
  const { locale } = stateFromLocation()
  if (event.origin === window.location.origin) {
    const guide = routeMessage(event.data, 'guide-route')
    if (guide === null) return
    const chapter = chapterFromGuidePath(guide)
    replaceEmbeddedPath(
      pathForPage(locale, chapter ? 'chapter' : 'guide', chapter),
    )
  } else if (event.origin === blogOrigin) {
    const blog = routeMessage(event.data, 'blog-route')
    if (blog === null) return
    const path = blogPath(blog)
    embedFrame.dataset.key = blogUrl(path || null)
    replaceEmbeddedPath(
      pathForPage(locale, path ? 'post' : 'blog', path || null),
    )
  }
}

function handleRequest(
  name: string,
  data: unknown,
  moduleName: string,
): HostState | null {
  if (moduleName !== 'SiteHost') return null
  if (name === 'getState') {
    ready = true
    stopAccessibility ??= enableLynxAccessibility(view)
    window.clearTimeout(loadTimeout)
    hostRoot.hidden = false
    const state = stateFromLocation()
    updateMetadata(state)
    return { ...state }
  }
  if (typeof data !== 'object' || data === null) return null

  if (
    name === 'navigate' &&
    'page' in data &&
    isPage(data.page) &&
    'id' in data &&
    isRouteId(data.page, data.id) &&
    'locale' in data &&
    isLocale(data.locale)
  ) {
    const path = pathForPage(data.locale, data.page, data.id)
    if (!parseSitePath(path, routeCatalog).matched) return null
    if (window.location.pathname !== path)
      window.history.pushState(null, '', path)
    rememberLocale(data.locale)
    sendState()
  }

  if (name === 'openExternal' && 'url' in data && isSafeExternalUrl(data.url)) {
    window.open(data.url, '_blank', 'noopener,noreferrer')
  }
  return null
}

restoreInitialLocale()
updateMetadata(stateFromLocation())
view.nativeModulesMap = {
  SiteHost: new URL('/site-host.js', window.location.href).href,
}
view.onNativeModulesCall = handleRequest
view.addEventListener('error', showError)
const loadTimeout = window.setTimeout(showError, 20_000)
view.url = new URL('/lynx/main.web.bundle', window.location.href).href
hostRoot.append(view)
const guideObserver = new MutationObserver(placeEmbed)
if (view.shadowRoot)
  guideObserver.observe(view.shadowRoot, { childList: true, subtree: true })

window.addEventListener('popstate', sendState)
window.addEventListener('message', followEmbed)
compactQuery.addEventListener('change', sendState)
motionQuery.addEventListener('change', sendState)

window.addEventListener('pagehide', (event) => {
  if (event.persisted) return
  window.clearTimeout(loadTimeout)
  window.removeEventListener('popstate', sendState)
  window.removeEventListener('message', followEmbed)
  guideObserver.disconnect()
  compactQuery.removeEventListener('change', sendState)
  motionQuery.removeEventListener('change', sendState)
  stopAccessibility?.()
})
