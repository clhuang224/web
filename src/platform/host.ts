import { nextTick, onMounted, onUnmounted, shallowRef } from 'vue-lynx'
import { isHostState } from '../domain/navigation'
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
    compact: false,
    reducedMotion: false,
  })

  function receiveState(value: unknown) {
    if (isHostState(value)) state.value = { ...value }
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
    // Request initial state after subscribing so fast host updates cannot be lost.
    void nextTick(() => nativeHost()?.getState(null, receiveState))
  })

  onUnmounted(() => emitter?.removeListener('host-state', receiveState))

  function navigate(page: Page) {
    nativeHost()?.navigate(
      { page, locale: state.value.locale },
      () => undefined,
    )
  }

  function setLocale(locale: Locale) {
    nativeHost()?.navigate({ page: state.value.page, locale }, () => undefined)
  }

  function openExternal(url: string) {
    nativeHost()?.openExternal({ url }, () => undefined)
  }

  return { state, navigate, setLocale, openExternal }
}
