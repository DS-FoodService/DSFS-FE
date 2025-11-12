import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite 프록시가 https://api.babsang.shop 로 중계
  withCredentials: false, // 토큰은 헤더로 보낼 거라 false
  timeout: 15000,
});

// 토큰 자동첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 처리
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      // 필요 시 전역 상태 초기화/리다이렉트 등
    }
    return Promise.reject(err);
  }
);

export default api;
