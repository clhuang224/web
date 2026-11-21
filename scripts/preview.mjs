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
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.bundle': 'application/octet-stream',
}
async function isFile(path) {
  try {
    return (await stat(path)).isFile()
  } catch {
    return false
  }
}

const route =
  /^(?:\/(?:en|ja))?(?:\/|\/(?:portfolio|drawings|about|behind-the-scenes)|\/(?:portfolio|behind-the-scenes)\/[\w-]+|\/drawing\/\d{2})?$/
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
    let target = file
    let status = 200
    if (path === '/guide' || path.startsWith('/guide/')) {
      const candidates = path.endsWith('/')
        ? [resolve(file, 'index.html')]
        : extname(path)
          ? [file]
          : [`${file}.html`, resolve(file, 'index.html')]
      target = resolve(directory, 'guide/404.html')
      status = 404
      for (const candidate of candidates)
        if (await isFile(candidate)) {
          target = candidate
          status = 200
          break
        }
      if (status === 404 && extname(path)) {
        response.writeHead(404).end('Not found')
        return
      }
      response.writeHead(status, {
        'Content-Type': types[extname(target)] || 'application/octet-stream',
      })
      response.end(await readFile(target))
      return
    }
    try {
      if (!(await stat(target)).isFile())
        target = resolve(directory, 'index.html')
    } catch {
      if (extname(path)) {
        response.writeHead(404).end('Not found')
        return
      }
      target = resolve(directory, 'index.html')
      if (!route.test(path.replace(/\/$/, ''))) status = 404
    }
    response.writeHead(status, {
      'Content-Type': types[extname(target)] || 'application/octet-stream',
    })
    response.end(await readFile(target))
  } catch {
    response.writeHead(500).end('Unable to load this page')
  }
}).listen(port, '0.0.0.0', () => console.log(`Local: http://localhost:${port}`))
