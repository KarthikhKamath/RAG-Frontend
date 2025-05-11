import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/session': 'http://localhost:3000',
      '/query': 'http://localhost:3000',
      '/history': 'http://localhost:3000',
    }
  }
})
