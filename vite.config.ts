import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cast process to any to avoid TS error about missing cwd() method in this context
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || 'https://api.moonshot.cn/v1'),
      'process.env.API_MODEL': JSON.stringify(env.API_MODEL || 'moonshot-v1-8k'),
    },
  }
})