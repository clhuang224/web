import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'

const embeddedKey = 'lynns.guide.embedded'

function isEmbedded() {
  if (window.parent !== window) return true
  try {
    if (new URLSearchParams(window.location.search).has('embedded'))
      window.sessionStorage.setItem(embeddedKey, 'true')
    return window.sessionStorage.getItem(embeddedKey) === 'true'
  } catch {
    return new URLSearchParams(window.location.search).has('embedded')
  }
}

function reportRoute() {
  window.parent.postMessage(
    { type: 'guide-route', path: window.location.pathname },
    window.location.origin,
  )
}

export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (typeof window === 'undefined' || !isEmbedded()) return
    document.documentElement.classList.add('embedded')
    if (window.parent === window) return
    const previous = router.onAfterRouteChange
    router.onAfterRouteChange = async (to) => {
      await previous?.(to)
      reportRoute()
    }
    reportRoute()
  },
} satisfies Theme
