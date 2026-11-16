import { spawn } from 'node:child_process'

const run = (args) =>
  spawn('pnpm', args, { stdio: 'inherit', shell: process.platform === 'win32' })
const preparation = run(['run', 'build:styles'])
const exitCode = await new Promise((resolve) => preparation.on('exit', resolve))
if (exitCode !== 0) process.exit(Number(exitCode) || 1)
const children = [
  run([
    'exec',
    'unocss',
    'src/**/*.vue',
    '-c',
    'uno.config.ts',
    '-o',
    'src/styles/uno.css',
    '--watch',
  ]),
  run(['run', 'dev:lynx']),
  run(['run', 'dev:host']),
]
function stop() {
  for (const child of children) child.kill('SIGTERM')
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
for (const child of children)
  child.on('exit', (code) => {
    if (code) {
      stop()
      process.exitCode = code
    }
  })
