import { describe, expect, it } from 'vitest'
import { parseRepository, repositoryFromSource } from './repository'

describe('GitHub repository data', () => {
  it('derives repository names only from GitHub source URLs', () => {
    expect(repositoryFromSource('https://github.com/clhuang224/bus')).toBe(
      'clhuang224/bus',
    )
    expect(repositoryFromSource('https://github.com/clhuang224')).toBeNull()
    expect(repositoryFromSource('https://gitlab.com/a/b')).toBeNull()
    expect(repositoryFromSource('not a url')).toBeNull()
  })

  it('keeps the displayed fields from a public repository response', () => {
    const summary = parseRepository({
      full_name: 'clhuang224/queener',
      language: 'Vue',
      stargazers_count: 3,
      pushed_at: '2026-11-01T08:00:00Z',
      private: false,
    })
    expect(summary).toEqual({
      name: 'clhuang224/queener',
      language: 'Vue',
      stars: 3,
      pushedAt: '2026-11-01T08:00:00Z',
    })
  })

  it.each([
    null,
    { message: 'API rate limit exceeded' },
    {
      full_name: 'a/b',
      language: 1,
      stargazers_count: 0,
      pushed_at: '2026-01-01',
    },
    {
      full_name: 'a/b',
      language: null,
      stargazers_count: 0,
      pushed_at: 'yesterday',
    },
  ])('rejects an incomplete or error response: %j', (value) =>
    expect(parseRepository(value)).toBeNull(),
  )
})
