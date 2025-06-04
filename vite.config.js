import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pagesPlugin from 'vite-plugin-pages'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pagesPlugin()],
})
