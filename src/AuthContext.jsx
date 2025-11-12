// AuthContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config.js";   // config.js 의 BASE URL 사용

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
  const toggleFavorite = async (restoId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요한 기능입니다.");

    await axios.post(
      `${API_BASE_URL}/bookmark/${restoId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setFavorites((prev) =>
      prev.includes(restoId)
        ? prev.filter((id) => id !== restoId)
        : [...prev, restoId]
    );
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
