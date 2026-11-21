import '@lynx-js/web-core/client'
import type { LynxViewElement } from '@lynx-js/web-core/client'
import { routeCatalog } from '../content/catalog'
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
import { fetchRepository, repositoryFromSource } from '../domain/repository'
import type { RepositorySummary } from '../domain/repository'
import type { HostState, ListPage, Locale } from '../domain/site'
import { enableLynxAccessibility } from './accessibility'
import './host.css'

const localeStorageKey = 'lynns.locale'
const knownRepositories = new Set(
  projects.flatMap((project) => repositoryFromSource(project.source) ?? []),
)
const repositoryRequests = new Map<string, Promise<RepositorySummary | null>>()
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

const copy = {
  'zh-TW': {
    pages: {
      home: '首頁',
      portfolio: '作品',
      drawings: '塗鴉',
      about: '關於',
      guide: '幕後',
    },
    drawing: '塗鴉',
    description: "Lynn's 的作品、文章與創作入口。",
    notFound: '找不到這個頁面。您可以從首頁繼續瀏覽。',
    error: '網站暫時無法載入。您仍可以閱讀網誌，或重新整理後再試。',
  },
  en: {
    pages: {
      home: 'Home',
      portfolio: 'Portfolio',
      drawings: 'Drawings',
      about: 'About',
      guide: 'Behind the scenes',
    },
    drawing: 'Drawing',
    description: 'Projects, selected writing, and creative work by Lynn.',
    notFound:
      'This page could not be found. You can continue from the homepage.',
    error:
      'The site could not load. You can still read the blog, or refresh to try again.',
  },
  ja: {
    pages: {
      home: 'ホーム',
      portfolio: '作品',
      drawings: '落書き',
      about: 'プロフィール',
      guide: '舞台裏',
    },
    drawing: '落書き',
    description: 'Lynn の作品、記事、創作活動を紹介するサイト。',
    notFound: 'ページが見つかりません。ホームからご覧ください。',
    error:
      'サイトを読み込めませんでした。ブログをご覧いただくか、再読み込みしてください。',
  },
} satisfies Record<
  Locale,
  {
    pages: Record<ListPage, string>
    drawing: string
    description: string
    notFound: string
    error: string
  }
>

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
  hostMessage.textContent = copy[state.locale].error
  hostStatus.hidden = false
  hostRoot.hidden = true
}

function pageTitle(state: HostState): string {
  const text = copy[state.locale]
  if (state.page === 'project')
    return (
      projects.find((project) => project.id === state.id)?.title ??
      text.pages.portfolio
    )
  if (state.page === 'drawing') return `${text.drawing} ${state.id ?? ''}`
  if (state.page === 'chapter')
    return (
      guideChapters.find((chapter) => chapter.slug === state.id)?.title ??
      text.pages.guide
    )
  return text.pages[state.page]
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
    ?.setAttribute('content', text.description)
  document
    .querySelector<HTMLMetaElement>('meta[property="og:title"]')
    ?.setAttribute('content', title)
  document
    .querySelector<HTMLMetaElement>('meta[property="og:description"]')
    ?.setAttribute('content', text.description)

  if (!location.matched) {
    hostMessage.textContent = text.notFound
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

let guideFrame: HTMLIFrameElement | undefined

function placeGuide() {
  const slot = view.shadowRoot?.querySelector<HTMLElement>('.guide-frame')
  if (!slot) {
    guideFrame = undefined
    return
  }
  if (guideFrame && slot.contains(guideFrame)) return
  const state = stateFromLocation()
  const frame = document.createElement('iframe')
  frame.className = 'guide-embed'
  frame.title = copy[state.locale].pages.guide
  frame.src = guidePath(state.page === 'chapter' ? state.id : null)
  frame.style.cssText = 'flex:1;width:100%;height:100%;border:0;display:block'
  slot.append(frame)
  guideFrame = frame
}

function followGuide(event: MessageEvent) {
  if (event.origin !== window.location.origin) return
  if (!guideFrame || event.source !== guideFrame.contentWindow) return
  const data: unknown = event.data
  if (
    typeof data !== 'object' ||
    data === null ||
    !('type' in data) ||
    data.type !== 'guide-route' ||
    !('path' in data) ||
    typeof data.path !== 'string'
  )
    return
  const state = stateFromLocation()
  const chapter = chapterFromGuidePath(data.path)
  const path = pathForPage(state.locale, chapter ? 'chapter' : 'guide', chapter)
  if (window.location.pathname === path) return
  window.history.replaceState(null, '', path)
  sendState()
}

function cachedRepository(name: string): Promise<RepositorySummary | null> {
  const cached = repositoryRequests.get(name)
  if (cached) return cached
  const request = fetchRepository(name)
  repositoryRequests.set(name, request)
  return request
}

function sendRepository(name: string) {
  void cachedRepository(name).then((repository) => {
    if (repository && ready)
      view.sendGlobalEvent('repository', [{ ...repository }])
  })
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

  if (
    name === 'getRepository' &&
    'name' in data &&
    typeof data.name === 'string' &&
    knownRepositories.has(data.name)
  ) {
    sendRepository(data.name)
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
const guideObserver = new MutationObserver(placeGuide)
if (view.shadowRoot)
  guideObserver.observe(view.shadowRoot, { childList: true, subtree: true })

window.addEventListener('popstate', sendState)
window.addEventListener('message', followGuide)
compactQuery.addEventListener('change', sendState)
motionQuery.addEventListener('change', sendState)

window.addEventListener('pagehide', (event) => {
  if (event.persisted) return
  window.clearTimeout(loadTimeout)
  window.removeEventListener('popstate', sendState)
  window.removeEventListener('message', followGuide)
  guideObserver.disconnect()
  compactQuery.removeEventListener('change', sendState)
  motionQuery.removeEventListener('change', sendState)
  stopAccessibility?.()
})
