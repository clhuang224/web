import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({ html: false, breaks: true }).disable([
  'table',
  'strikethrough',
])

function inlineSpans(tokens) {
  const spans = []
  let bold = 0
  let italic = 0
  let href
  for (const token of tokens) {
    if (token.type === 'strong_open') bold += 1
    else if (token.type === 'strong_close') bold -= 1
    else if (token.type === 'em_open') italic += 1
    else if (token.type === 'em_close') italic -= 1
    else if (token.type === 'link_open') {
      href = token.attrGet('href')
      const url = new URL(href)
      if (!(
        (url.protocol === 'https:' && url.hostname) ||
        (url.protocol === 'mailto:' && url.pathname)
      ))
        throw new Error(
          'Markdown links must use an absolute HTTPS or mailto URL.',
        )
    } else if (token.type === 'link_close') href = undefined
    else if (
      token.type === 'text' ||
      token.type === 'code_inline' ||
      token.type === 'softbreak' ||
      token.type === 'hardbreak'
    ) {
      spans.push({
        text: token.type.endsWith('break') ? '\n' : token.content,
        ...(bold > 0 ? { bold: true } : {}),
        ...(italic > 0 ? { italic: true } : {}),
        ...(token.type === 'code_inline' ? { code: true } : {}),
        ...(href ? { href } : {}),
      })
    } else {
      throw new Error(`Unsupported inline Markdown: ${token.type}`)
    }
  }
  return spans
}

function blocksFromTokens(tokens, cursor, closing) {
  const blocks = []
  while (cursor.index < tokens.length) {
    const token = tokens[cursor.index++]
    if (token.type === closing) return blocks
    if (token.type === 'paragraph_open' || token.type === 'heading_open') {
      const inline = tokens[cursor.index++]
      if (inline?.type !== 'inline')
        throw new Error('Expected inline Markdown.')
      const spans = inlineSpans(inline.children ?? [])
      const kind = token.type === 'heading_open' ? 'heading' : 'paragraph'
      blocks.push({
        kind,
        ...(kind === 'heading' ? { level: Number(token.tag.slice(1)) } : {}),
        spans,
      })
      cursor.index += 1
    } else if (token.type === 'blockquote_open') {
      blocks.push({
        kind: 'quote',
        blocks: blocksFromTokens(tokens, cursor, 'blockquote_close'),
      })
    } else if (
      token.type === 'bullet_list_open' ||
      token.type === 'ordered_list_open'
    ) {
      const items = []
      const closingList = token.type.replace('_open', '_close')
      while (tokens[cursor.index]?.type !== closingList) {
        if (tokens[cursor.index++]?.type !== 'list_item_open')
          throw new Error('Expected a Markdown list item.')
        items.push(blocksFromTokens(tokens, cursor, 'list_item_close'))
      }
      cursor.index += 1
      blocks.push({
        kind: 'list',
        ordered: token.type === 'ordered_list_open',
        start: Number(token.attrGet('start') ?? 1),
        items,
      })
    } else if (token.type === 'fence' || token.type === 'code_block') {
      blocks.push({ kind: 'code', text: token.content.replace(/\n$/, '') })
    } else if (token.type === 'hr') blocks.push({ kind: 'rule' })
    else throw new Error(`Unsupported Markdown block: ${token.type}`)
  }
  if (closing) throw new Error(`Missing Markdown closing token: ${closing}`)
  return blocks
}

function timestampForDate(date) {
  const parts = date.split(/[/: ]/)
  const limits = [null, [1, 12], [1, 31], [0, 23], [0, 59], [0, 59]]
  for (let index = 1; index < parts.length; index++) {
    const value = Number(parts[index])
    if (value < limits[index][0] || value > limits[index][1])
      throw new Error('A supplied date component is outside its valid range.')
  }
  return Array.from({ length: 6 }, (_, index) =>
    (parts[index] ?? '').padStart(index === 0 ? 4 : 2, '0'),
  ).join('')
}

export function parseMarkdownStory(source) {
  const { data, content } = matter(source)
  if (Object.keys(data).some((key) => key !== 'date'))
    throw new Error(
      'Only the optional date field belongs in content frontmatter.',
    )
  if (
    data.date !== undefined &&
    (typeof data.date !== 'string' ||
      !/^\d{4}(?:\/\d{1,2}(?:\/\d{1,2}(?: \d{1,2}(?::\d{1,2}(?::\d{1,2})?)?)?)?)?$/.test(
        data.date,
      ))
  )
    throw new Error(
      'Quote the date as YYYY/MM/DD HH:mm; partial dates are allowed.',
    )
  const blocks = blocksFromTokens(markdown.parse(content, {}), { index: 0 })
  if (blocks.length === 0)
    throw new Error('A doodle story must contain Markdown.')
  return {
    ...(data.date
      ? { date: data.date, timestamp: timestampForDate(data.date) }
      : {}),
    blocks,
  }
}
