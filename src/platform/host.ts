import { nextTick, onMounted, onUnmounted, shallowRef } from 'vue-lynx'
import { routeCatalog } from '../content/catalog'
import { isDetailPage, isHostState, isRouteId } from '../domain/navigation'
import { fetchRepository, isRepositorySummary } from '../domain/repository'
import type { RepositorySummary } from '../domain/repository'
import type { HostState, Locale, Page } from '../domain/site'
import { isStandalone, nativeHost } from './runtime'

interface GlobalEventEmitter {
  addListener(name: string, callback: (value: unknown) => void): void
  removeListener(name: string, callback: (value: unknown) => void): void
}

declare const lynx: {
  getJSModule(name: 'GlobalEventEmitter'): GlobalEventEmitter | undefined
}
declare const SystemInfo:
  { pixelWidth?: number; pixelRatio?: number } | undefined

function standaloneCompact() {
  if (typeof SystemInfo === 'undefined') return false
  const { pixelWidth, pixelRatio } = SystemInfo ?? {}
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

  const repositories = shallowRef<Record<string, RepositorySummary>>({})
  const browserUrl = shallowRef<string | null>(null)

  function receiveState(value: unknown) {
    if (isHostState(value)) state.value = { ...value }
  }

  function receiveRepository(value: unknown) {
    if (isRepositorySummary(value))
      repositories.value = { ...repositories.value, [value.name]: value }
  }

  let emitter: GlobalEventEmitter | undefined

  onMounted(() => {
    emitter =
      typeof lynx === 'undefined'
        ? undefined
        : lynx.getJSModule('GlobalEventEmitter')
    emitter?.addListener('host-state', receiveState)
    emitter?.addListener('repository', receiveRepository)
    // Request initial state after subscribing so fast host updates cannot be lost.
    void nextTick(() => nativeHost()?.getState(null, receiveState))
  })

  onUnmounted(() => {
    emitter?.removeListener('host-state', receiveState)
    emitter?.removeListener('repository', receiveRepository)
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

  function requestRepository(name: string) {
    if (repositories.value[name]) return
    if (standalone) void fetchRepository(name).then(receiveRepository)
    else nativeHost()?.getRepository({ name }, () => undefined)
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
    repositories,
    navigate,
    setLocale,
    openExternal,
    requestRepository,
    browserUrl,
    closeBrowser,
  }
}
