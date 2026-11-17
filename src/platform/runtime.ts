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

export function asset(path: string) {
  return isStandalone() ? `${import.meta.env.ASSET_PREFIX}${path}` : path
}
