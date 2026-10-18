import js from '@eslint/js'
import globals from 'globals'
import ts from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import {defineConfig,globalIgnores} from 'eslint/config'

export default defineConfig([
 globalIgnores(['dist/**','design-reference/**','ios/**','android/**']),
 {files:['scripts/**/*.mjs','eslint.config.js'],languageOptions:{globals:globals.node},rules:js.configs.recommended.rules},
 {
  files:['src/App.tsx','src/index.tsx','src/App.test.tsx','src/pages/**/*.tsx','src/components/**/*.tsx','vite.config.ts'],
  languageOptions:{parser:ts.parser,globals:{...globals.browser,...globals.node}},
  plugins:{'@typescript-eslint':ts.plugin,'react-hooks':reactHooks},
  rules:{...ts.configs.recommended.rules,...reactHooks.configs.recommended.rules},
 },
])
