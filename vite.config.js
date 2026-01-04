import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 프론트에서 '/api/...' 로 부르면, 백엔드로 프록시
      // Netlify 설정과 동일하게: /api/* -> api.babsang.shop/:splat (/api 제거)
      '/api': {
        target: 'https://api.babsang.shop',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
