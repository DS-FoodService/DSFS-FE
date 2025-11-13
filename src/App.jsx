import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./api/client";
import {
  AUTH_LOGIN, AUTH_SIGNUP,
  FAV_LIST, FAV_TOGGLE,
  REVIEWS_LIST,
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
import { AuthProvider } from "./AuthContext";

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

  // --- 1. 토큰 기반 로그인 유지 ---
  useEffect(() => {
    const fetchAuthData = async () => {
      if (!token) {
        setIsAuthReady(true);
        return;
      }

      try {
        const { data: favData } = await api.get(`${FAV_LIST}?page=0&size=10`);
        setFavorites(favData?.result?.restaurants?.map(r => r.restaurantId) || []);
        setUser({ isLoggedIn: true });
      } catch (error) {
        console.warn("⚠️ Token 인증 실패 (자동 로그아웃 방지):", error);
        setUser({ isLoggedIn: true });
      } finally {
        setIsAuthReady(true);
      }
    };
    fetchAuthData();
  }, [token]);

  // --- 2. 로그인 / 회원가입 / 로그아웃 ---
  const login = async (email, password, navigate) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const tokenFromServer = data.result?.accessToken;
      if (!tokenFromServer) throw new Error("토큰이 응답에 없습니다.");
      localStorage.setItem("token", tokenFromServer);
      setToken(tokenFromServer);
      setUser({ isLoggedIn: true });
      alert("로그인 성공!");
      navigate("/"); // ✅ 로그인 후 홈으로 이동
    } catch (err) {
      console.error("로그인 오류:", err);
      alert(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  const signup = async (email, password, navigate) => {
  try {
    const { data } = await api.post("/auth/signup", {
      userEmail: email,     // 서버 요구 이름에 맞춰 변경
      userPw: password,
    });
    console.log("회원가입 응답:", data);

    // 실제 응답 구조 확인 후 여기를 맞춰야 함
    const tokenFromServer = data.accessToken || data.result?.accessToken;
    if (!tokenFromServer) throw new Error("토큰이 응답에 없습니다.");

    localStorage.setItem("token", tokenFromServer);
    setToken(tokenFromServer);
    alert("회원가입이 완료되었습니다!");
    navigate("/");
  } catch (err) {
    console.error("회원가입 오류:", err);
    alert(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
  }
};


  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setFavorites([]);
  };

  const toggleFavorite = async (restaurantId) => {
    try {
      if (!token) return alert("로그인 후 이용해주세요.");
      const { data } = await api.post("/api/bookmark", { restaurantId });
      console.log("찜 API 성공:", data);
    } catch (err) {
      console.error("❌ 찜 API 실패:", err);
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

  if (!isAuthReady) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

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
