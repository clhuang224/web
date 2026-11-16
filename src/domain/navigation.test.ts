import { describe, expect, it } from 'vitest'
import {
  isHostState,
  isSafeExternalUrl,
  parseSitePath,
  pathForPage,
} from './navigation'
import { locales, pages } from './site'

describe('localized locations', () => {
  it('round-trips every supported page and locale', () => {
    for (const locale of locales) {
      for (const page of pages) {
        expect(parseSitePath(pathForPage(locale, page))).toEqual({
          locale,
          page,
          matched: true,
        })
      }
    }
  })

  it.each([
    ['/portfolio', 'zh-TW', 'portfolio'],
    ['/en/about/', 'en', 'about'],
    ['/ja', 'ja', 'home'],
  ])(
    'reads explicit route %s independently of preferences',
    (path, locale, page) => {
      expect(parseSitePath(path)).toEqual({ locale, page, matched: true })
    },
  )

  it.each([
    '/unknown',
    '/en/unknown',
    '/portfolio/extra',
    '//about',
    '/home',
    'about',
  ])('does not claim an unknown path is a valid page: %s', (path) =>
    expect(parseSitePath(path).matched).toBe(false),
  )
})

describe('host boundary', () => {
  it('accepts complete typed host messages and rejects partial messages', () => {
    expect(
      isHostState({
        locale: 'ja',
        page: 'about',
        compact: true,
        reducedMotion: false,
      }),
    ).toBe(true)
    expect(
      isHostState({
        locale: 'fr',
        page: 'home',
        compact: true,
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
