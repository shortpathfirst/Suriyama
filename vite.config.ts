import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Suriyama/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2023',
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript'
    }
  }
})
