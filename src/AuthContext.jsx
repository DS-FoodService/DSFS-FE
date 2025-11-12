// AuthContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config.js";   // config.js 의 BASE URL 사용
import api from "./api/client";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  /* 로그인 */
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const token = res.data?.accessToken || res.data?.token;

      if (!token) throw new Error("토큰이 응답에 없습니다.");

      localStorage.setItem("token", token);
      setUser(res.data.user);

    } catch (err) {
      alert("로그인 실패. 이메일/비밀번호를 확인하세요.");
      throw err;
    }
  };


  /* 회원가입 (Swagger 기준: email + password 만 전달) */
  const signup = async (email, password) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
      });

      alert("회원가입 완료! 로그인 해주세요.");

      setPage("login");

    } catch (err) {
      alert(err.response?.data?.message || "회원가입 중 오류 발생");
      throw err;
    }
  };


  /* 북마크 (찜) 토글 */
  const toggleFavorite = async (restaurantId, isCurrentlyFavorite) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("로그인 후 이용해주세요.");

  await api.post(
    `/bookmark/${restaurantId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // UI 즉시 반영
  setFavorites(prev =>
    isCurrentlyFavorite
      ? prev.filter(id => id !== restaurantId)
      : [...prev, restaurantId]
  );
};


  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        favorites,
        toggleFavorite,
        setPage,
        showLoginModal: () => setPage("login"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
