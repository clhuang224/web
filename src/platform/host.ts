import { nextTick, onMounted, onUnmounted, shallowRef } from 'vue-lynx'
import { isHostState } from '../domain/navigation'
import { isRepositorySummary } from '../domain/repository'
import type { RepositorySummary } from '../domain/repository'
import type { HostState, Locale, Page, SiteHostModule } from '../domain/site'

interface GlobalEventEmitter {
  addListener(name: string, callback: (value: unknown) => void): void
  removeListener(name: string, callback: (value: unknown) => void): void
}

// These ambient declarations describe only the bridge this application owns.
declare const NativeModules: { SiteHost?: SiteHostModule }
declare const lynx: {
  getJSModule(name: 'GlobalEventEmitter'): GlobalEventEmitter | undefined
}

export function useHost() {
  const state = shallowRef<HostState>({
    locale: 'zh-TW',
    page: 'home',
    id: null,
    compact: false,
    reducedMotion: false,
  })

  const repositories = shallowRef<Record<string, RepositorySummary>>({})

  function receiveState(value: unknown) {
    if (isHostState(value)) state.value = { ...value }
  }

  function receiveRepository(value: unknown) {
    if (isRepositorySummary(value))
      repositories.value = { ...repositories.value, [value.name]: value }
  }

  function nativeHost() {
    return typeof NativeModules === 'undefined'
      ? undefined
      : NativeModules.SiteHost
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
    nativeHost()?.navigate(
      { page, id, locale: state.value.locale },
      () => undefined,
    )
  }

  function setLocale(locale: Locale) {
    const { page, id } = state.value
    nativeHost()?.navigate({ page, id, locale }, () => undefined)
  }

  function requestRepository(name: string) {
    if (!repositories.value[name])
      nativeHost()?.getRepository({ name }, () => undefined)
  }

  function openExternal(url: string) {
    nativeHost()?.openExternal({ url }, () => undefined)
  }

  return {
    state,
    repositories,
    navigate,
    setLocale,
    openExternal,
    requestRepository,
  }
}
