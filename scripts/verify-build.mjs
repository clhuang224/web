import { access, readFile } from 'node:fs/promises'

for (const path of [
  'dist/index.html',
  'dist/lynx/main.web.bundle',
  'dist/site-host.js',
  'dist/images/brand/lynns-wordmark.svg',
  'dist/guide/index.html',
  'dist/guide/carousel.html',
])
  await access(path)
const html = await readFile('dist/index.html', 'utf8')
if (!html.includes('site-root') || !html.includes('blog.lynns.me'))
  throw new Error('Static host is incomplete')
console.log(
  'Verified static host, Lynx bundle, bridge, guide, and original artwork.',
)
