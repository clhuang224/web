import { describe, expect, it } from 'vitest'
import { doodles } from '../content/doodles'
import { alignIndex, stepIndex, visibleCount } from './carousel'

describe('doodle carousel progression', () => {
  it.each([
    { compact: false, count: 2, groups: 7 },
    { compact: true, count: 1, groups: 14 },
  ])(
    'shows every drawing once per cycle when compact=$compact',
    ({ compact, count, groups }) => {
      const size = visibleCount(compact)
      expect(size).toBe(count)
      const visited: string[] = []
      let index = 0
      for (let group = 0; group < groups; group += 1) {
        visited.push(
          ...doodles.slice(index, index + size).map((doodle) => doodle.id),
        )
        index = stepIndex(index, doodles.length, size, 1)
      }
      expect(visited).toEqual(doodles.map((doodle) => doodle.id))
      expect(new Set(visited).size).toBe(doodles.length)
      expect(index).toBe(0)
    },
  )

  it.each([false, true])(
    'moves backwards from the first group and returns when compact=%s',
    (compact) => {
      const size = visibleCount(compact)
      const last = stepIndex(0, doodles.length, size, -1)
      expect(doodles.slice(last, last + size).at(-1)?.id).toBe(
        doodles.at(-1)?.id,
      )
      expect(stepIndex(last, doodles.length, size, 1)).toBe(0)
    },
  )

  it('keeps the current mobile drawing visible when switching to desktop pairs', () => {
    const mobileIndex = doodles.length - 1
    const desktopIndex = alignIndex(
      mobileIndex,
      doodles.length,
      visibleCount(false),
    )
    expect(desktopIndex).toBe(12)
    expect(doodles.slice(desktopIndex, desktopIndex + 2)).toContain(
      doodles[mobileIndex],
    )
    expect(alignIndex(desktopIndex, doodles.length, visibleCount(true))).toBe(
      12,
    )
  })

  it('keeps empty collections at the initial index', () => {
    expect(alignIndex(8, 0, 2)).toBe(0)
    expect(stepIndex(0, 0, 2, 1)).toBe(0)
    expect(stepIndex(0, 0, 1, -1)).toBe(0)
  })
})
