// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./api/client";
import {
  AUTH_LOGIN, AUTH_SIGNUP, FAV_LIST,
} from "./api/endpoints";
import { AuthContext } from "./AuthContext.jsx";
import { Header, Footer } from "./Layout.jsx";

import HomePage from "./Homepage.jsx";
import LoginPage from "./login.jsx";
import SignUpPage from "./Signin.jsx";
import MenuPage from "./MenuPage.jsx";
import OffCampusPage from "./OffCampusPage.jsx";
import DetailPage from "./DetailPage.jsx";
import MyReviews from "./MyReviews.jsx";

const KAKAO_APP_KEY = "8668be1b8e7bcc2a3ba8e26af8f107c6";

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [favorites, setFavorites] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --- 0. 카카오 지도 로드 ---
  useEffect(() => {
    if (!document.getElementById("kakao-maps-script")) {
      const script = document.createElement("script");
      script.id = "kakao-maps-script";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing&autoload=false`;
      script.async = true;
      script.onload = () => window.kakao?.maps?.load(() => console.log("Kakao Maps API loaded."));
      document.head.appendChild(script);
    }
  }, []);

  // --- A. 전역 401 인터셉터 ---
  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      (err) => {
        const url = err?.config?.url || "";
        const isAuthPath = url.includes("/auth/login") || url.includes("/auth/signup");
        if (err?.response?.status === 401 && !isAuthPath) {
          console.warn("⚠️ 인증 만료로 로그아웃 처리");
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
          setToken(null);
          setUser(null);
          setFavorites([]);
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  // --- 1. 토큰 유지 + 찜 목록 로드 ---
  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!token) {
          setIsAuthReady(true);
          return;
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const { data: favData } = await api.get(`${FAV_LIST}?page=0&size=100`);
        const favIds =
          favData?.result?.restaurants?.map((r) => r.restaurantId) ||
          favData?.result?.map?.((r) => r.restaurantId) ||
          [];
        setFavorites(favIds);
        setUser({ isLoggedIn: true });
      } catch (e) {
        console.warn("⚠️ 토큰 검증 실패:", e);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
        setToken(null);
        setFavorites([]);
      } finally {
        setIsAuthReady(true);
      }
    };
    bootstrap();
  }, [token]);

  // --- 2. 회원가입 / 로그인 / 로그아웃 ---
  const signup = async (email, password, navigate) => {
    try {
      delete api.defaults.headers.common["Authorization"]; // 회원가입엔 토큰 필요없음
      const { data } = await api.post(AUTH_SIGNUP, { email, password });
      console.log("회원가입 응답:", data);
      alert("회원가입이 완료되었습니다! 로그인 해주세요.");
      navigate("/login");
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const login = async (email, password, navigate) => {
    try {
      delete api.defaults.headers.common["Authorization"]; // 로그인엔 토큰 필요없음
      const { data } = await api.post(AUTH_LOGIN, { email, password });
      console.log("로그인 응답:", data);

      const tokenFromServer = data.result?.accessToken || data.accessToken;
      if (!tokenFromServer) throw new Error("토큰이 응답에 없습니다.");

      localStorage.setItem("token", tokenFromServer);
      setToken(tokenFromServer);
      api.defaults.headers.common["Authorization"] = `Bearer ${tokenFromServer}`;
      setUser({ isLoggedIn: true });

      alert("로그인 성공!");
      navigate("/");
    } catch (err) {
      console.error("로그인 오류:", err);
      alert(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    setFavorites([]);
  };

  // --- 3. 찜 토글 ---
  const toggleFavorite = async (restaurantId) => {
    try {
      if (!token) return alert("로그인 후 이용해주세요.");
      await api.post("/bookmark", { restaurantId });

      setFavorites((prev) =>
        prev.includes(restaurantId)
          ? prev.filter((id) => id !== restaurantId)
          : [...prev, restaurantId]
      );
    } catch (err) {
      console.error("❌ 찜 API 실패:", err);
      if (err?.response?.status === 401) alert("로그인이 필요합니다.");
    }
  };

  const authContextValue = {
    user,
    isLoggedIn: !!user,
    favorites,
    login,
    signup,
    logout,
    toggleFavorite,
  };

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <Header />
        <main className="relative z-10 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/offcampus" element={<OffCampusPage />} />
            <Route path="/detail/:restaurantId" element={<DetailPage />} />
            <Route path="/myreviews" element={<MyReviews />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}
