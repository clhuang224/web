import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { locales } from '../domain/site'
import { aboutStory } from './about'
import { selectedArticles } from './articles'
import { copy } from './copy'
import { doodles } from './doodles'
import { platforms, projects } from './projects'
import { tagColors } from './tags'

const publicRoot = new URL('../../public/', import.meta.url)

describe('published content resources', () => {
  it('provides the same complete interface vocabulary in all three languages', () => {
    expect([...locales]).toEqual(['zh-TW', 'en', 'ja'])
    const keys = Object.keys(copy['zh-TW']).sort()
    for (const locale of locales) {
      expect(Object.keys(copy[locale]).sort()).toEqual(keys)
      expect(
        Object.values(copy[locale]).every((value) => value.trim().length > 0),
      ).toBe(true)
    }
  })

  it('tells the About story with the same structure in every language', () => {
    const shape = (locale: (typeof locales)[number]) => ({
      serious: aboutStory[locale].serious.map((paragraph) => paragraph.length),
      trivia: aboutStory[locale].trivia.map((paragraph) => paragraph.length),
    })
    for (const locale of locales) {
      expect(shape(locale)).toEqual(shape('zh-TW'))
      expect(aboutStory[locale].date).toBe(aboutStory['zh-TW'].date)
      expect(
        [
          ...aboutStory[locale].serious.flat(),
          ...aboutStory[locale].trivia.flat(),
          aboutStory[locale].divider,
        ].every((line) => line.trim().length > 0),
      ).toBe(true)
    }
  })

  it('features the three selected projects with shared destinations and translated summaries', () => {
    expect(projects.map((project) => project.title)).toEqual([
      'Finding the Bus',
      'Queener',
      'PrePrompt',
    ])
    expect(new Set(projects.map((project) => project.id)).size).toBe(
      projects.length,
    )
    for (const project of projects) {
      expect(new URL(project.website).protocol).toBe('https:')
      expect(new URL(project.source).hostname).toBe('github.com')
      expect(Object.keys(project.summary).sort()).toEqual([...locales].sort())
      for (const locale of locales)
        expect(project.summary[locale].trim().length).toBeGreaterThan(0)
    }
  })

  it('covers the actual fourteen original drawings with translated descriptions', () => {
    const directory = new URL('images/doodles/', publicRoot)
    const files = readdirSync(directory)
      .filter((name) => name.endsWith('.png'))
      .sort()
    expect(doodles).toHaveLength(14)
    expect(
      doodles.map((doodle) => doodle.src.split('/').at(-1)).sort(),
    ).toEqual(files)
    expect(doodles.map((doodle) => doodle.id)).toEqual(
      Array.from({ length: 14 }, (_, index) =>
        String(index + 1).padStart(2, '0'),
      ),
    )
    for (const doodle of doodles) {
      const image = readFileSync(new URL(doodle.src.slice(1), publicRoot))
      expect([image.readUInt32BE(16), image.readUInt32BE(20)]).toEqual([
        851, 315,
      ])
      expect(Object.keys(doodle.alt).sort()).toEqual([...locales].sort())
      for (const locale of locales)
        expect(doodle.alt[locale].trim().length).toBeGreaterThan(0)
    }
  })

  it('resolves every platform icon to an existing SVG and uses secure external destinations', () => {
    for (const platform of platforms) {
      expect(
        existsSync(new URL(`images/icons/${platform.icon}.svg`, publicRoot)),
      ).toBe(true)
      expect(new URL(platform.url).protocol).toBe('https:')
    }
  })

  it('links curated articles to published blog posts', () => {
    expect(selectedArticles.length).toBeGreaterThan(0)
    const ids = new Set(selectedArticles.map((article) => article.id))
    expect(ids.size).toBe(selectedArticles.length)
    for (const article of selectedArticles) {
      const url = new URL(article.url)
      expect(url.origin).toBe('https://blog.lynns.me')
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      for (const locale of locales) {
        expect(article.title[locale].trim()).not.toBe('')
        expect(article.summary[locale].trim()).not.toBe('')
      }
    }
  })

  it('gives every published tag its own color', () => {
    const tags = new Set(
      [...projects, ...selectedArticles].flatMap((item) => item.tags),
    )
    for (const tag of tags) expect(tagColors[tag]).toMatch(/^#[0-9a-f]{6}$/)
    const colors = Object.values(tagColors)
    expect(new Set(colors).size).toBe(colors.length)
  })
})
