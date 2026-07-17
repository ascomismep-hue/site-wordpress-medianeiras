import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // Alterado para '/' para funcionar corretamente com domínios customizados no GitHub Pages
  base: '/', 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Otimização para build
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
