import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'

const directory = resolve('dist')
const port = Number(process.env.PORT || 4173)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.wasm': 'application/wasm',
  '.bundle': 'application/octet-stream',
}
const routes = new Set([
  '/',
  '/portfolio',
  '/about',
  '/en',
  '/en/',
  '/en/portfolio',
  '/en/about',
  '/ja',
  '/ja/',
  '/ja/portfolio',
  '/ja/about',
])
createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(
      new URL(request.url || '/', 'http://localhost').pathname,
    )
    const file = resolve(directory, `.${path}`)
    if (file !== directory && !file.startsWith(`${directory}${sep}`)) {
      response.writeHead(403).end()
      return
    }
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
    let target = file
    let status = 200
    try {
      if (!(await stat(target)).isFile())
        target = resolve(directory, 'index.html')
    } catch {
      if (extname(path)) {
        response.writeHead(404).end('Not found')
        return
      }
      target = resolve(directory, 'index.html')
      if (!routes.has(path.replace(/\/$/, '') || '/')) status = 404
    }
    response.writeHead(status, {
      'Content-Type': types[extname(target)] || 'application/octet-stream',
    })
    response.end(await readFile(target))
  } catch {
    response.writeHead(500).end('Unable to load this page')
  }
}).listen(port, '0.0.0.0', () => console.log(`Local: http://localhost:${port}`))
