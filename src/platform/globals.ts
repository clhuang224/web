import type { SiteHostModule } from '../domain/site'

export interface GlobalEventEmitter {
  addListener(name: string, callback: (value: unknown) => void): void
  removeListener(name: string, callback: (value: unknown) => void): void
}

interface LynxGlobal {
  getJSModule?(name: 'GlobalEventEmitter'): GlobalEventEmitter | undefined
  __globalProps?: unknown
}

interface SystemInfoGlobal {
  platform?: string
  pixelWidth?: number
  pixelRatio?: number
}

declare const lynx: LynxGlobal | undefined
declare const SystemInfo: SystemInfoGlobal | undefined
declare const NativeModules: { SiteHost?: SiteHostModule | null } | undefined

export function lynxGlobal(): LynxGlobal | undefined {
  return typeof lynx === 'undefined' ? undefined : (lynx ?? undefined)
}

export function systemInfo(): SystemInfoGlobal | undefined {
  return typeof SystemInfo === 'undefined'
    ? undefined
    : (SystemInfo ?? undefined)
}

export function siteHostModule(): SiteHostModule | null | undefined {
  return typeof NativeModules === 'undefined'
    ? undefined
    : NativeModules?.SiteHost
}
