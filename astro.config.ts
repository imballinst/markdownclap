import { defineConfig } from 'astro/config'

import solid from '@astrojs/solid-js'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

// https://astro.build/config
export default defineConfig({
  integrations: [solid()],
  vite: {
    plugins: [
      monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'html']
      })
    ]
  }
})
