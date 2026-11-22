import type { Doodle } from '../domain/site'
import { doodleStories } from './generated/doodle-stories'

const doodleCount = 14

export const doodles: Doodle[] = Array.from(
  { length: doodleCount },
  (_, index) => {
    const id = String(index + 1).padStart(2, '0')
    const story = doodleStories[id]
    return {
      id,
      number: index + 1,
      src: `/images/doodles/${story?.timestamp ?? `doodle-${id}`}.png`,
      story,
    }
  },
)
