import { describe, expect, it } from 'vitest'
import {
  isHostState,
  isSafeExternalUrl,
  parseSitePath,
  pathForPage,
} from './navigation'
import type { RouteCatalog } from './navigation'
import { detailPages, listPages, locales, pages, sectionOf } from './site'

const catalog: RouteCatalog = {
  project: ['queener'],
  drawing: ['01', '14'],
  chapter: ['carousel'],
  post: ['2026/02/03/20260203-daily-note'],
}

describe('localized locations', () => {
  it('round-trips every supported page and locale', () => {
    for (const locale of locales) {
      for (const page of pages) {
        const id = detailPages.some((detail) => detail === page)
          ? catalog[page as keyof RouteCatalog][0]
          : null
        expect(parseSitePath(pathForPage(locale, page, id), catalog)).toEqual({
          locale,
          page,
          id,
          matched: true,
        })
      }
    }
  })

  it.each([
    ['/portfolio', 'zh-TW', 'portfolio', null],
    ['/en/about/', 'en', 'about', null],
    ['/ja', 'ja', 'home', null],
    ['/drawings', 'zh-TW', 'drawings', null],
    ['/en/portfolio/queener', 'en', 'project', 'queener'],
    ['/ja/drawing/14', 'ja', 'drawing', '14'],
    ['/behind-the-scenes', 'zh-TW', 'guide', null],
    ['/en/behind-the-scenes/carousel', 'en', 'chapter', 'carousel'],
    ['/blog', 'zh-TW', 'blog', null],
    [
      '/ja/blog/2026/02/03/20260203-daily-note/',
      'ja',
      'post',
      '2026/02/03/20260203-daily-note',
    ],
    ['/blog/archives', 'zh-TW', 'post', 'archives'],
  ])(
    'reads explicit route %s independently of preferences',
    (path, locale, page, id) => {
      expect(parseSitePath(path, catalog)).toEqual({
        locale,
        page,
        id,
        matched: true,
      })
    },
  )

  it.each([
    '/unknown',
    '/en/unknown',
    '/portfolio/missing',
    '/portfolio/queener/extra',
    '/drawing/15',
    '/drawing',
    '/drawings/01',
    '/behind-the-scenes/missing',
    '/blog/2026/../about',
    '//about',
    '/home',
    'about',
  ])('does not claim an unknown path is a valid page: %s', (path) =>
    expect(parseSitePath(path, catalog).matched).toBe(false),
  )
})

describe('host boundary', () => {
  it('accepts complete typed host messages and rejects partial messages', () => {
    expect(
      isHostState({
        locale: 'ja',
        page: 'about',
        id: null,
        compact: true,
        reducedMotion: false,
      }),
    ).toBe(true)
    expect(
      isHostState({
        locale: 'fr',
        page: 'home',
        id: null,
        compact: true,
        reducedMotion: false,
      }),
    ).toBe(false)
    expect(
      isHostState({
        locale: 'en',
        page: 'drawing',
        id: '01',
        compact: false,
        reducedMotion: false,
      }),
    ).toBe(true)
    expect(
      isHostState({
        locale: 'en',
        page: 'drawing',
        id: null,
        compact: false,
        reducedMotion: false,
      }),
    ).toBe(false)
    expect(isHostState({ locale: 'en', page: 'home' })).toBe(false)
    expect(isHostState(null)).toBe(false)
  })

  it.each([
    'https://blog.lynns.me',
    'https://github.com/clhuang224',
    'mailto:hello@example.com',
  ])('accepts a supported external destination: %s', (url) =>
    expect(isSafeExternalUrl(url)).toBe(true),
  )

  it.each([
    'javascript:alert(1)',
    'data:text/html,hello',
    'http://example.com',
    '/about',
    '',
    ' https://example.com',
    'mailto:',
  ])('rejects an unsupported external destination: %s', (url) =>
    expect(isSafeExternalUrl(url)).toBe(false),
  )
})

describe('page sections', () => {
  it('keeps list pages as their own section', () => {
    for (const page of listPages) expect(sectionOf(page)).toBe(page)
  })

  it('places each detail page under its listing', () => {
    expect(detailPages.map(sectionOf)).toEqual([
      'portfolio',
      'drawings',
      'guide',
      'blog',
    ])
  })
})
