// src/api/client.js
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";

const api = axios.create({
  baseURL: isProduction
    ? "https://api.babsang.shop"
    : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터
api.interceptors.request.use((config) => {
  // 공개 접근 허용 API
  const publicPaths = [
    "/auth/login",
    "/auth/signup",
    "/restaurants", // 로그인 없이 목록은 조회 가능하도록 유지
  ];

  const isPublic = publicPaths.some((path) => config.url?.includes(path));

  if (!isPublic) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;
