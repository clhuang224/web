import { defineConfig } from '@rsbuild/core'

export default defineConfig({
  source: { entry: { index: './src/host/index.ts' } },
  html: { template: './src/host/index.html', title: "Lynn's" },
  output: {
    distPath: { root: 'dist' },
    cleanDistPath: false,
    copy: [{ from: './src/host/site-host.mjs', to: 'site-host.js' }],
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/lynx': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        pathRewrite: { '^/lynx': '' },
      },
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
