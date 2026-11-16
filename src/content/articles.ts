import type { Localized } from '../domain/site'

export interface SelectedArticle {
  id: string
  title: Localized<string>
  summary: Localized<string>
  url: string
  language: 'zh-TW'
}

export const selectedArticles: SelectedArticle[] = []
