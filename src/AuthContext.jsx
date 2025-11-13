// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "./api/client";
import axios from "axios";
import { API_BASE_URL } from "./config.js";

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
      setUser(res.data.user || { email });

      // 로그인 후 북마크 목록 불러오기
      await fetchFavorites();

    } catch (err) {
      console.error("❌ 로그인 실패:", err);
      alert("로그인 실패. 이메일/비밀번호를 확인하세요.");
      throw err;
    }
  };

  /* 회원가입 */
  const signup = async (email, password) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
      });
      alert("회원가입 완료! 로그인 해주세요.");
    } catch (err) {
      alert(err.response?.data?.message || "회원가입 중 오류 발생");
      throw err;
    }
  };

  /* 찜 목록 불러오기 */
  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await api.get("/bookmark", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.result?.length) {
        setFavorites(data.result.map((b) => b.restaurantId));
      }
    } catch (err) {
      console.warn("⚠️ 찜 목록 불러오기 실패 (무시 가능):", err);
    }
  };

  /* 찜 토글 */
  const toggleFavorite = async (restaurantId, isCurrentlyFavorite) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인 후 이용해주세요.");

    try {
      await api.post(
        `/bookmark/${restaurantId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 즉시 UI 업데이트
      setFavorites((prev) =>
        isCurrentlyFavorite
          ? prev.filter((id) => id !== restaurantId)
          : [...prev, restaurantId]
      );
    } catch (err) {
      console.error("❌ 찜 토글 실패:", err);
      alert("찜 상태를 변경할 수 없습니다.");
    }
  };

  /* 자동 로그인 유지 (페이지 새로고침 시 토큰 유지) */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchFavorites();
      setUser({ token }); // 최소한의 user 세팅
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        favorites,
        login,
        signup,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* 커스텀 훅 */
export const useAuth = () => useContext(AuthContext);
