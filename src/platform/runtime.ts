import { guidePath } from '../content/guide'
import type { SiteHostModule } from '../domain/site'

// These ambient declarations describe only the bridge this application owns.
declare const NativeModules: { SiteHost?: SiteHostModule | null }

export function nativeHost() {
  return typeof NativeModules === 'undefined'
    ? undefined
    : NativeModules.SiteHost
}

declare const SystemInfo: { platform?: string } | undefined

export function isStandalone() {
  return typeof SystemInfo !== 'undefined' && SystemInfo?.platform !== 'web'
}

const publicOrigin = import.meta.env.DEV
  ? import.meta.env.ASSET_PREFIX
  : 'https://lynns.me'

export function asset(path: string) {
  return isStandalone() ? `${publicOrigin}${path}` : path
}

const guideOrigin = import.meta.env.DEV
  ? 'http://127.0.0.1:3000'
  : 'https://lynns.me'

export function guideUrl(chapter: string | null) {
  return `${guideOrigin}${guidePath(chapter)}?embedded`
}

declare const lynx: { __globalProps?: unknown } | undefined

function globalNumber(props: object, key: string) {
  const value: unknown = Reflect.get(props, key)
  return typeof value === 'number' && value > 0 ? value : 0
}

export function safeAreaInsets() {
  const props = typeof lynx === 'undefined' ? undefined : lynx?.__globalProps
  if (!isStandalone() || typeof props !== 'object' || props === null)
    return { top: 0, bottom: 0 }
  const fullscreen = Reflect.get(props, 'fullscreen')
  if (fullscreen !== true && fullscreen !== 'true') return { top: 0, bottom: 0 }
  return {
    top: globalNumber(props, 'safeAreaTop'),
    bottom: globalNumber(props, 'safeAreaBottom'),
  }
}
