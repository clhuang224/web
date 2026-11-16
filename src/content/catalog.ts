import type { RouteCatalog } from '../domain/navigation'
import { doodles } from './doodles'
import { projects } from './projects'

export const routeCatalog: RouteCatalog = {
  project: projects.map((project) => project.id),
  drawing: doodles.map((doodle) => doodle.id),
}
