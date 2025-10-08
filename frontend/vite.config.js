import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    fs: {
      strict: false,
    },
  },
  build: {
    rollupOptions: {},
  },
  preview: {
    // 👇 ensures fallback works in preview mode too
    historyApiFallback: true,
  },
})
