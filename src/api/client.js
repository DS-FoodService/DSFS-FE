// src/api/client.js
import axios from "axios";

const isProduction = import.meta.env.MODE === "production";

const api = axios.create({
  baseURL: isProduction
    ? "https://api.babsang.shop" // ✅ 배포용
    : "/api",                    // ✅ 로컬 개발용 (Vite proxy 사용)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
