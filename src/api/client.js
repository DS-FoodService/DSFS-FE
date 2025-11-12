import axios from "axios";
import { API_BASE_URL } from "../config.js";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const excludeAuth = ["/auth/signup", "/auth/login"]; // ✅ 회원가입/로그인 제외

  if (!excludeAuth.some((url) => config.url.includes(url)) && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
