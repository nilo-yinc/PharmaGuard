import { defineConfig } from 'vite' // Reload: 2026-02-19T19:23:33+05:30
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
    // Resolve .tsx/.ts before .js so TypeScript files take priority over compiled JS duplicates
    extensions: ['.mjs', '.mts', '.tsx', '.ts', '.jsx', '.js', '.json', '.vue'],
  },
})
