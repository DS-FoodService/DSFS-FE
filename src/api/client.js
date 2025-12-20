// api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // ✅ 프록시 경로
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
