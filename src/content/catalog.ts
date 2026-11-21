import type { RouteCatalog } from '../domain/navigation'
import { selectedArticles } from './articles'
import { doodles } from './doodles'
import { guideChapters } from './guide'
import { projects } from './projects'

export const routeCatalog: RouteCatalog = {
  project: projects.map((project) => project.id),
  drawing: doodles.map((doodle) => doodle.id),
  chapter: guideChapters.map((chapter) => chapter.slug),
  post: selectedArticles.map((article) => article.id),
}
