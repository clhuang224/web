import { readFile, readdir, stat } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const documentationRoot = fileURLToPath(new URL('../', import.meta.url))
const guideRoot = resolve(documentationRoot, 'guide/zh-TW')
const repositoryRoot = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(documentationRoot, '..')
const sourcePrefix = 'https://github.com/clhuang224/web/blob/main/'
const failures = []

async function filesUnder(directory, accept) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await filesUnder(path, accept)))
    else if (accept(path)) files.push(path)
  }
  return files
}

async function isFile(path) {
  try {
    return (await stat(path)).isFile()
  } catch {
    return false
  }
}

const pages = await filesUnder(guideRoot, (path) => path.endsWith('.md'))
const sources = await filesUnder(resolve(repositoryRoot, 'src'), (path) =>
  /\.(ts|vue)$/.test(path),
)
const sourceTexts = await Promise.all(
  sources.map((path) => readFile(path, 'utf8')),
)
const graph = new Map()
let localLinks = 0
let sourceLinks = 0
let excerpts = 0

for (const page of pages) {
  const text = await readFile(page, 'utf8')
  const targets = []
  for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (target.startsWith(sourcePrefix)) {
      sourceLinks += 1
      const path = resolve(
        repositoryRoot,
        decodeURIComponent(target.slice(sourcePrefix.length).split('#')[0]),
      )
      if (!path.startsWith(`${repositoryRoot}${sep}`) || !(await isFile(path)))
        failures.push(`${relative(guideRoot, page)}: missing source ${target}`)
    } else if (!/^(?:https?:|mailto:|#)/.test(target)) {
      localLinks += 1
      const path = resolve(dirname(page), target.split('#')[0])
      if (!(await isFile(path)))
        failures.push(`${relative(guideRoot, page)}: missing link ${target}`)
      if (path.endsWith('.md')) targets.push(path)
    }
  }
  graph.set(page, targets)

  for (const [, excerpt] of text.matchAll(/```(?:ts|vue)\n([\s\S]*?)\n```/g)) {
    excerpts += 1
    if (!sourceTexts.some((source) => source.includes(excerpt.trim())))
      failures.push(`${relative(guideRoot, page)}: source excerpt has drifted`)
  }
}

const visited = new Set()
const pending = [resolve(guideRoot, 'index.md')]
while (pending.length) {
  const page = pending.pop()
  if (visited.has(page)) continue
  visited.add(page)
  pending.push(...(graph.get(page) ?? []))
}
for (const page of pages)
  if (!visited.has(page))
    failures.push(`${relative(guideRoot, page)}: unreachable from the entry`)

if (failures.length) {
  for (const failure of failures) process.stderr.write(`${failure}\n`)
  process.exitCode = 1
} else {
  process.stdout.write(
    `Guide checks passed: ${pages.length} pages, ${localLinks} local links, ${sourceLinks} source references, ${excerpts} source excerpts.\n`,
  )
}
