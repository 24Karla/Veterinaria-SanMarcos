import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/tests/preparacion.tsx'],
    pool: 'forks',
    maxWorkers: 1,
    fileParallelism: false,
  },
})