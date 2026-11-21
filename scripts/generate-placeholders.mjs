import { readdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const directory = 'public/images/doodles'
const entries = []
for (const name of (await readdir(directory)).sort()) {
  if (!name.endsWith('.png')) continue
  const buffer = await sharp(`${directory}/${name}`)
    .resize({ width: 24 })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()
  entries.push(
    `  '/images/doodles/${name}':\n    'data:image/png;base64,${buffer.toString('base64')}',`,
  )
}
await writeFile(
  'src/content/doodle-placeholders.ts',
  `export const doodlePlaceholders: Readonly<Record<string, string>> = {\n${entries.join('\n')}\n}\n`,
)
console.log(`Wrote ${entries.length} doodle placeholders.`)
