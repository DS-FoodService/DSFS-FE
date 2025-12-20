import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 프론트에서 '/api/...' 로 부르면, 아래 백엔드로 프록시
      '/api': {
        target: 'https://api.babsang.shop',
        changeOrigin: true,
        secure: true, // 백엔드가 https면 true 권장
        // 필요 시 경로 조정:
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
