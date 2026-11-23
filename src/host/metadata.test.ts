import { describe, expect, it } from 'vitest'
import type { HostState } from '../domain/site'
import { pageTitle } from './metadata'

const base: HostState = {
  locale: 'en',
  page: 'home',
  id: null,
  compact: false,
  reducedMotion: false,
}

describe('page titles', () => {
  it('uses the navigation label for list pages', () => {
    expect(pageTitle({ ...base, page: 'about' })).toBe('About')
    expect(pageTitle({ ...base, locale: 'ja', page: 'about' })).toBe('紹介')
  })

  it('names detail pages after their content', () => {
    expect(pageTitle({ ...base, page: 'project', id: 'queener' })).toBe(
      'Queener',
    )
    expect(pageTitle({ ...base, page: 'drawing', id: '04' })).toBe('Drawing 04')
  })

  it('falls back to the listing name for unknown content', () => {
    expect(pageTitle({ ...base, page: 'project', id: 'missing' })).toBe(
      'Portfolio',
    )
  })
})
