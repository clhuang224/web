import { inject } from 'vue-lynx'
import type { InjectionKey } from 'vue-lynx'
import type { useHost } from '../platform/host'

type SiteContext = ReturnType<typeof useHost>
export const siteContextKey: InjectionKey<SiteContext> = Symbol('site-context')

export function useSite(): SiteContext {
  const context = inject(siteContextKey)
  if (!context) throw new Error('Site context is missing')
  return context
}
