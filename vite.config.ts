import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` มาจาก env var (BASE_PATH) เพื่อไม่ต้อง hardcode username/repo
// - local dev / preview  -> '/'
// - GitHub Pages         -> '/<repo-name>/' (ตั้งค่าให้ใน .github/workflows/deploy.yml)
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2019',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
