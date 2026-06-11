import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` is set to './' so the build works on any static host
// (Netlify, Vercel, and GitHub Pages project pages all served correctly).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
  },
})
