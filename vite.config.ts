import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path is essential for GitHub Pages (usually /repo-name/ or ./)
  base: './', 
  build: {
    outDir: 'dist',
  }
})