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

export const guideUrl = import.meta.env.DEV
  ? 'http://127.0.0.1:3000/guide/'
  : 'https://lynns.me/guide/'
