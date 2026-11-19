import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'docs/.vitepress/cache/**',
      'node_modules/**',
      'work/**',
      'src/styles/uno.css',
      'src/assets/**',
      'src/App.css',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.{js,mjs,ts,vue}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser, extraFileExtensions: ['.vue'] },
    },
  },
  {
    files: ['src/host/**/*.ts'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['src/{components,pages,platform,app}/**/*.{ts,vue}', 'src/App.vue'],
    rules: {
      'no-restricted-globals': ['error', 'window', 'document', 'localStorage'],
      'vue/multi-word-component-names': 'off',
    },
  },
  prettier,
)
