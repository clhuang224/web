import { nextTick, onMounted, onUnmounted, shallowRef } from 'vue-lynx'
import { routeCatalog } from '../content/catalog'
import { isDetailPage, isHostState, isRouteId } from '../domain/navigation'
import type { HostState, Locale, Page } from '../domain/site'
import { lynxGlobal, systemInfo } from './globals'
import type { GlobalEventEmitter } from './globals'
import { isStandalone, nativeHost } from './runtime'

function standaloneCompact() {
  const { pixelWidth, pixelRatio } = systemInfo() ?? {}
  return !!pixelWidth && !!pixelRatio && pixelWidth / pixelRatio < 768
}

function isKnownRoute(page: Page, id: string | null) {
  if (!isRouteId(page, id)) return false
  return !isDetailPage(page) || routeCatalog[page].includes(id ?? '')
}

export function useHost() {
  const standalone = isStandalone()
  const state = shallowRef<HostState>({
    locale: 'zh-TW',
    page: 'home',
    id: null,
    compact: standalone && standaloneCompact(),
    reducedMotion: false,
  })

  const browserUrl = shallowRef<string | null>(null)

  function receiveState(value: unknown) {
    if (isHostState(value)) state.value = { ...value }
  }

  let emitter: GlobalEventEmitter | undefined

  onMounted(() => {
    emitter = lynxGlobal()?.getJSModule?.('GlobalEventEmitter')
    emitter?.addListener('host-state', receiveState)
    // Request initial state after subscribing so fast host updates cannot be lost.
    void nextTick(() => nativeHost()?.getState(null, receiveState))
  })

  onUnmounted(() => {
    emitter?.removeListener('host-state', receiveState)
  })

  function navigate(page: Page, id: string | null = null) {
    if (standalone) {
      if (isKnownRoute(page, id)) state.value = { ...state.value, page, id }
      return
    }
    nativeHost()?.navigate(
      { page, id, locale: state.value.locale },
      () => undefined,
    )
  }

  function setLocale(locale: Locale) {
    const { page, id } = state.value
    if (standalone) {
      state.value = { ...state.value, locale }
      return
    }
    nativeHost()?.navigate({ page, id, locale }, () => undefined)
  }

  function openExternal(url: string) {
    if (standalone) browserUrl.value = url
    else nativeHost()?.openExternal({ url }, () => undefined)
  }

  function closeBrowser() {
    browserUrl.value = null
  }

  return {
    state,
    navigate,
    setLocale,
    openExternal,
    browserUrl,
    closeBrowser,
  }
}
