import { articleAt } from '../content/articles'
import { copy } from '../content/copy'
import { guideChapters } from '../content/guide'
import { projects } from '../content/projects'
import type { HostState } from '../domain/site'

export function pageTitle(state: HostState): string {
  const text = copy[state.locale]
  if (state.page === 'project')
    return (
      projects.find((project) => project.id === state.id)?.title ??
      text.portfolio
    )
  if (state.page === 'drawing') return `${text.drawingLabel} ${state.id ?? ''}`
  if (state.page === 'post')
    return articleAt(state.id)?.title[state.locale] ?? text.blog
  if (state.page === 'chapter')
    return (
      guideChapters.find((chapter) => chapter.slug === state.id)?.title ??
      text.guide
    )
  return text[state.page]
}

function setMeta(selector: string, content: string) {
  document
    .querySelector<HTMLMetaElement>(selector)
    ?.setAttribute('content', content)
}

export function applyMetadata(state: HostState, matched: boolean) {
  const description = copy[state.locale].siteDescription
  const title = `${pageTitle(state)} · Lynn's`
  document.documentElement.lang = state.locale
  document.documentElement.dataset.routeStatus = matched ? 'found' : 'not-found'
  document.title = title
  setMeta('meta[name="description"]', description)
  setMeta('meta[property="og:title"]', title)
  setMeta('meta[property="og:description"]', description)
}
