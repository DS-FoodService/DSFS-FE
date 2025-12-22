import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 프론트에서 '/api/...' 로 부르면, 백엔드로 프록시
      '/api': {
        target: 'https://api.babsang.shop',
        changeOrigin: true,
        secure: true,
        // /api/restaurants → api.babsang.shop/restaurants
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
