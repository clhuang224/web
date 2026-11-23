import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url)
const { routeCatalog } = await jiti.import('../src/content/catalog.ts')
const { pathForPage } = await jiti.import('../src/domain/navigation.ts')
const { listPages, locales } = await jiti.import('../src/domain/site.ts')

const directory = resolve('dist')
const index = resolve(directory, 'index.html')
const paths = new Set()
for (const locale of locales) {
  for (const page of listPages) paths.add(pathForPage(locale, page))
  for (const [page, ids] of Object.entries(routeCatalog))
    for (const id of ids) paths.add(pathForPage(locale, page, id))
}

let written = 0
for (const path of paths) {
  if (path === '/') continue
  const target = resolve(directory, `.${path.replace(/\/$/, '')}`, 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await copyFile(index, target)
  written += 1
}
await copyFile(index, resolve(directory, '404.html'))
await writeFile(resolve(directory, 'CNAME'), 'lynns.me\n')
if (!(await readFile(resolve(directory, 'guide/index.html'), 'utf8')))
  throw new Error('Guide output is missing')
console.log(`Prepared ${written} route pages, 404.html, and CNAME for Pages.`)
