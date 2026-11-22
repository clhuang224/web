import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { doodleStories } from '../src/content/generated/doodle-stories.ts'
import { aboutStory } from '../src/content/generated/about.ts'
import { doodles } from '../src/content/doodles.ts'
import { parseMarkdownStory } from './lib/markdown-content.mjs'

describe('doodle Markdown content', () => {
  it('keeps the generated About content in sync with its editable Markdown', () => {
    const source = readFileSync(
      new URL('../src/content/about.md', import.meta.url),
      'utf8',
    )
    expect(aboutStory).toEqual(parseMarkdownStory(source))
  })
  it('keeps line breaks and inline formatting in a paragraph', () => {
    const story = parseMarkdownStory(
      'First **bold** and *italic* with `code`.\nNext line.',
    )
    expect(story.blocks).toEqual([
      {
        kind: 'paragraph',
        spans: [
          { text: 'First ' },
          { text: 'bold', bold: true },
          { text: ' and ' },
          { text: 'italic', italic: true },
          { text: ' with ' },
          { text: 'code', code: true },
          { text: '.' },
          { text: '\n' },
          { text: 'Next line.' },
        ],
      },
    ])
    expect(story.date).toBeUndefined()
    expect(story.timestamp).toBeUndefined()
  })

  it('supports nested lists, quotes, headings, code blocks and rules', () => {
    const story = parseMarkdownStory(
      '## Section\n\n> Quote\n\n3. First\n   - Nested\n4. Second\n\n```ts\nconst value = 1\n```\n\n---',
    )
    const [heading, quote, list, code, rule] = story.blocks
    expect(heading).toEqual({
      kind: 'heading',
      level: 2,
      spans: [{ text: 'Section' }],
    })
    expect(quote.kind).toBe('quote')
    expect(quote.blocks[0].spans).toEqual([{ text: 'Quote' }])
    expect(list).toMatchObject({ kind: 'list', ordered: true, start: 3 })
    expect(list.items).toHaveLength(2)
    expect(list.items[0][1]).toMatchObject({ kind: 'list', ordered: false })
    expect(code).toEqual({ kind: 'code', text: 'const value = 1' })
    expect(rule).toEqual({ kind: 'rule' })
  })

  it('preserves HTTPS and mailto links for the host bridge', () => {
    const story = parseMarkdownStory(
      '[Site](https://example.com) and [Mail](mailto:hello@example.com)',
    )
    expect(story.blocks[0].spans).toEqual([
      { text: 'Site', href: 'https://example.com' },
      { text: ' and ' },
      { text: 'Mail', href: 'mailto:hello@example.com' },
    ])
    expect(() => parseMarkdownStory('[Relative](/about)')).toThrow()
  })

  it('treats raw HTML as text and rejects inline images instead of dropping them', () => {
    expect(parseMarkdownStory('<b>Text</b>').blocks[0].spans).toEqual([
      { text: '<b>Text</b>' },
    ])
    expect(() =>
      parseMarkdownStory('![Image](https://example.com/image.png)'),
    ).toThrow('Unsupported inline Markdown: image')
  })

  it.each([
    ['2021/7/30 23:07', '20210730230700'],
    ['2021/2/13 13:44:05', '20210213134405'],
    ['2021/7', '20210700000000'],
    ['2021', '20210000000000'],
  ])(
    'zero-pads supplied components without inventing missing time for %s',
    (date, timestamp) => {
      expect(
        parseMarkdownStory(`---\ndate: '${date}'\n---\nText`),
      ).toMatchObject({ date, timestamp })
    },
  )

  it('rejects empty content, invented title fields and invalid dates', () => {
    expect(() => parseMarkdownStory('')).toThrow('must contain Markdown')
    expect(() => parseMarkdownStory('---\ntitle: Title\n---\nText')).toThrow(
      'Only the optional date',
    )
    expect(() => parseMarkdownStory('---\ndate: 2021\n---\nText')).toThrow(
      'Quote the date',
    )
    expect(() =>
      parseMarkdownStory("---\ndate: '2021/13/01'\n---\nText"),
    ).toThrow('valid range')
  })

  it('keeps generated stories in sync with the editable files and stable drawing IDs', () => {
    const directory = new URL('../src/content/doodles/', import.meta.url)
    const sources = readdirSync(directory)
      .filter((name) => name.endsWith('.md'))
      .sort()
    expect(Object.keys(doodleStories).sort()).toEqual(
      sources.map((name) => name.slice(0, -3)),
    )
    for (const name of sources) {
      const id = name.slice(0, -3)
      expect(doodles.some((doodle) => doodle.id === id)).toBe(true)
      expect(doodleStories[id]).toEqual(
        parseMarkdownStory(readFileSync(new URL(name, directory), 'utf8')),
      )
    }
  })
})
