import { defineConfig, presetMini } from 'unocss'

export default defineConfig({
  content: { filesystem: ['src/**/*.vue'] },
  presets: [presetMini({ preflight: false })],
})
