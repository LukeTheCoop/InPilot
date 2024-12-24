import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // 1) The React content script entry
        contentScript: resolve(__dirname, 'src/contentScript.tsx'),
        // 2) The popup entry (plain HTML or a separate React app)
        popup: resolve(__dirname, 'index.html'),
      },
      output: {
        // You can name the JS files however you want
        entryFileNames: '[name].js',
      },
    },
  },
})
