import { blogOrigin, blogPath, blogUrl } from '../content/articles'
import { copy } from '../content/copy'
import { chapterFromGuidePath, guidePath } from '../content/guide'
import { pathForPage } from '../domain/navigation'
import type { HostState } from '../domain/site'
import loaderStyles from './loader.css?raw'
import { stateFromLocation } from './location'

function createLoader(shadow: ShadowRoot) {
  if (!shadow.querySelector('style[data-loader]')) {
    const style = document.createElement('style')
    style.dataset.loader = ''
    style.textContent = loaderStyles
    shadow.append(style)
  }
  const overlay = document.createElement('div')
  overlay.className = 'embed-loader'
  const loader = document.createElement('span')
  loader.className = 'site-loader'
  loader.setAttribute('aria-hidden', 'true')
  for (let index = 0; index < 3; index += 1) {
    const dot = document.createElement('span')
    dot.className = 'site-loader-dot'
    loader.append(dot)
  }
  overlay.append(loader)
  return overlay
}

function embedSource(slot: HTMLElement, state: HostState) {
  if (slot.classList.contains('embed-blog'))
    return blogUrl(state.page === 'post' ? state.id : null)
  return guidePath(state.page === 'chapter' ? state.id : null)
}

function routeMessage(data: unknown, type: string) {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('type' in data) ||
    data.type !== type ||
    !('path' in data) ||
    typeof data.path !== 'string'
  )
    return null
  return data.path
}

export function createEmbeds(
  shadow: ShadowRoot,
  replacePath: (path: string) => void,
) {
  let frame: HTMLIFrameElement | undefined

  function place() {
    const slot = shadow.querySelector<HTMLElement>('.embed-frame')
    if (!slot) {
      frame = undefined
      return
    }
    const state = stateFromLocation()
    const blog = slot.classList.contains('embed-blog')
    const source = embedSource(slot, state)
    const key = blog ? source : 'guide'
    if (frame && slot.contains(frame) && frame.dataset.key === key) return
    frame?.remove()
    slot.querySelector('.embed-loader')?.remove()
    const loader = createLoader(shadow)
    const next = document.createElement('iframe')
    next.className = 'embedded-page'
    next.dataset.key = key
    next.title = copy[state.locale][blog ? 'blog' : 'guide']
    next.src = source
    next.style.cssText = 'flex:1;width:100%;height:100%;border:0;display:block'
    next.addEventListener('load', () => loader.remove(), { once: true })
    slot.append(next, loader)
    frame = next
  }

  function follow(event: MessageEvent) {
    if (!frame || event.source !== frame.contentWindow) return
    const { locale } = stateFromLocation()
    if (event.origin === window.location.origin) {
      const guide = routeMessage(event.data, 'guide-route')
      if (guide === null) return
      const chapter = chapterFromGuidePath(guide)
      replacePath(pathForPage(locale, chapter ? 'chapter' : 'guide', chapter))
    } else if (event.origin === blogOrigin) {
      const blog = routeMessage(event.data, 'blog-route')
      if (blog === null) return
      const path = blogPath(blog)
      frame.dataset.key = blogUrl(path || null)
      replacePath(pathForPage(locale, path ? 'post' : 'blog', path || null))
    }
  }

  const observer = new MutationObserver(place)
  observer.observe(shadow, { childList: true, subtree: true })
  window.addEventListener('message', follow)

  return () => {
    observer.disconnect()
    window.removeEventListener('message', follow)
  }
}
