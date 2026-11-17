import { defineConfig } from '@lynx-js/rspeedy'
import { pluginVueLynx } from 'vue-lynx/plugin'

export default defineConfig({
  environments: { lynx: {}, web: {} },
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
