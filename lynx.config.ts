import { defineConfig } from '@lynx-js/rspeedy'
import { pluginVueLynx } from 'vue-lynx/plugin'

const devHost = process.env.LYNX_DEV_HOST ?? '127.0.0.1'

export default defineConfig({
  source: {
    define: {
      'import.meta.env.DEV_HOST_ORIGIN': JSON.stringify(
        `http://${devHost}:3000`,
      ),
    },
  },
  environments: {
    lynx: { output: { assetPrefix: 'https://lynns.me/lynx/' } },
    web: {},
  },
  server: { port: 3001, strictPort: true, host: process.env.LYNX_DEV_HOST },
  output: { distPath: { root: 'dist/lynx' } },
  plugins: [
    pluginVueLynx({
      optionsApi: false,
      enableCSSInlineVariables: true,
      enableCSSInheritance: true,
    }),
  ],
})
