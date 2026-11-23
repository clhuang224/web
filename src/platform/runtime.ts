import { guidePath } from '../content/guide'
import { lynxGlobal, siteHostModule, systemInfo } from './globals'

export function nativeHost() {
  return siteHostModule()
}

export function isStandalone() {
  const info = systemInfo()
  return info !== undefined && info.platform !== 'web'
}

const publicOrigin = import.meta.env.DEV
  ? import.meta.env.ASSET_PREFIX
  : 'https://lynns.me'

export function asset(path: string) {
  return isStandalone() ? `${publicOrigin}${path}` : path
}

const guideOrigin = import.meta.env.DEV
  ? import.meta.env.DEV_HOST_ORIGIN
  : 'https://lynns.me'

export function guideUrl(chapter: string | null) {
  return `${guideOrigin}${guidePath(chapter)}?embedded`
}

function globalNumber(props: object, key: string) {
  const value: unknown = Reflect.get(props, key)
  return typeof value === 'number' && value > 0 ? value : 0
}

export function safeAreaInsets() {
  const props = lynxGlobal()?.__globalProps
  if (!isStandalone() || typeof props !== 'object' || props === null)
    return { top: 0, bottom: 0 }
  const fullscreen = Reflect.get(props, 'fullscreen')
  if (fullscreen !== true && fullscreen !== 'true') return { top: 0, bottom: 0 }
  return {
    top: globalNumber(props, 'safeAreaTop'),
    bottom: globalNumber(props, 'safeAreaBottom'),
  }
}
