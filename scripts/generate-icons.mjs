import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { icons } = JSON.parse(
  await readFile(require.resolve('@iconify-json/ri/icons.json'), 'utf8'),
)
const names = [
  'github-line',
  'soundcloud-line',
  'translate-2',
  'linkedin-box-line',
  'arrow-left-line',
  'arrow-down-s-line',
  'arrow-up-s-line',
  'arrow-right-line',
  'arrow-right-up-line',
  'pause-line',
  'play-line',
]
await mkdir('public/images/icons', { recursive: true })
for (const name of names) {
  const icon = icons[name]
  if (!icon) throw new Error(`Missing Remix Icon: ${name}`)
  const body = icon.body.replaceAll('currentColor', '#456065')
  await writeFile(
    `public/images/icons/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${body}</svg>\n`,
  )
}
