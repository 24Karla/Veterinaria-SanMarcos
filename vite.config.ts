import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  test: {
    environment: 'jsdom',
    pool: 'forks',
    maxWorkers: 1,
    fileParallelism: false,
  },
})