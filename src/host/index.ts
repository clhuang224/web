import '@lynx-js/web-core/client'
import type { LynxViewElement } from '@lynx-js/web-core/client'
import { routeCatalog } from '../content/catalog'
import { copy } from '../content/copy'
import {
  isLocale,
  isPage,
  isRouteId,
  isSafeExternalUrl,
  parseSitePath,
  pathForPage,
} from '../domain/navigation'
import type { HostState } from '../domain/site'
import { enableLynxAccessibility } from './accessibility'
import { createEmbeds } from './embed'
import {
  compactQuery,
  currentLocation,
  motionQuery,
  rememberLocale,
  restoreInitialLocale,
  stateFromLocation,
} from './location'
import { applyMetadata } from './metadata'
import './host.css'
import './loader.css'

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

function showMessage(text: string) {
  hostMessage.textContent = text
  hostStatus.classList.remove('host-status-loading')
  hostStatus.hidden = false
}

function showError() {
  showMessage(copy[stateFromLocation().locale].loadError)
  hostRoot.hidden = true
}

function updateMetadata(state: HostState) {
  const { matched } = currentLocation()
  applyMetadata(state, matched)
  if (!matched) showMessage(copy[state.locale].pageNotFound)
  else if (ready) hostStatus.hidden = true
}

function sendState() {
  const state = stateFromLocation()
  updateMetadata(state)
  if (ready) view.sendGlobalEvent('host-state', [{ ...state }])
}

function replacePath(path: string) {
  if (window.location.pathname === path) return
  window.history.replaceState(null, '', path)
  sendState()
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
const stopEmbeds = view.shadowRoot
  ? createEmbeds(view.shadowRoot, replacePath)
  : undefined

window.addEventListener('popstate', sendState)
compactQuery.addEventListener('change', sendState)
motionQuery.addEventListener('change', sendState)

window.addEventListener('pagehide', (event) => {
  if (event.persisted) return
  window.clearTimeout(loadTimeout)
  window.removeEventListener('popstate', sendState)
  stopEmbeds?.()
  compactQuery.removeEventListener('change', sendState)
  motionQuery.removeEventListener('change', sendState)
  stopAccessibility?.()
})
