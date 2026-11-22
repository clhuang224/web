export interface MarkdownSpan {
  text: string
  bold?: boolean
  italic?: boolean
  code?: boolean
  href?: string
}

export type MarkdownBlock =
  | { kind: 'paragraph'; spans: readonly MarkdownSpan[] }
  | { kind: 'heading'; level: number; spans: readonly MarkdownSpan[] }
  | { kind: 'quote'; blocks: readonly MarkdownBlock[] }
  | {
      kind: 'list'
      ordered: boolean
      start: number
      items: readonly (readonly MarkdownBlock[])[]
    }
  | { kind: 'code'; text: string }
  | { kind: 'rule' }

export interface MarkdownStory {
  date?: string
  timestamp?: string
  blocks: readonly MarkdownBlock[]
}
