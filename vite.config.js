import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // Isso força o Vite a usar caminhos relativos para scripts e CSS
  base: './', 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
