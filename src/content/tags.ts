export const tagColors: Readonly<Record<string, string>> = {
  React: '#087ea4',
  TypeScript: '#3178c6',
  Vue: '#2f7d5b',
  JavaScript: '#8a6d00',
  HTML: '#c8381b',
  'Redux Toolkit': '#764abc',
  Vite: '#5b5fe0',
  Notion: '#191919',
}

export const fallbackTagColor = '#9747ff'

export function tagColor(tag: string) {
  return tagColors[tag] ?? fallbackTagColor
}
