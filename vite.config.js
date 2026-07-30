import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Exclude directories that OneDrive may lock (e.g. cats/)
      // and node_modules to avoid EBUSY errors on Windows
      ignored: [
        '**/node_modules/**',
        '**/cats/**',
      ],
    },
  },
})
