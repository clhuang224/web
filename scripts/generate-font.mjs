import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import subsetFont from 'subset-font'

const source = 'src/assets/fonts/jf-openhuninn-2.1.ttf'
const target = 'public/fonts/jf-openhuninn.woff2'
const roots = ['src', 'docs']
const extensions = /\.(ts|vue|md|mts|html|css)$/
const skipped = new Set(['node_modules', 'cache', '.temp', 'dist', 'assets'])

async function* textFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) yield* textFiles(path)
    else if (extensions.test(entry.name)) yield path
  }
}

const characters = new Set()
for (let code = 0x20; code <= 0x7e; code += 1)
  characters.add(String.fromCodePoint(code))
for (const character of '，。、；：？！「」『』（）《》〈〉…—～・·‧／＼％＋－＝＠＃＆＊')
  characters.add(character)
for (const root of roots)
  for await (const path of textFiles(root))
    for (const character of await readFile(path, 'utf8'))
      if (character.codePointAt(0) > 0x7e) characters.add(character)

const subset = await subsetFont(
  await readFile(source),
  [...characters].join(''),
  { targetFormat: 'woff2' },
)
await mkdir('public/fonts', { recursive: true })
await writeFile(target, subset)
console.log(
  `Wrote ${target}: ${characters.size} characters, ${Math.round(subset.length / 1024)} KiB.`,
)
