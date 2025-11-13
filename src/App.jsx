import { useState, useEffect } from "react";

import api from "./api/client";
import {
  AUTH_LOGIN, AUTH_SIGNUP,
  FAV_LIST, FAV_TOGGLE,
  REVIEWS_LIST,
} from "./api/endpoints";

import { AuthContext } from "./AuthContext.jsx";

// 레이아웃
import { Header, Footer } from "./Layout.jsx";

// 페이지
import HomePage from "./Homepage.jsx";
import LoginPage from "./login.jsx";
import SignUpPage from "./Signin.jsx";
import MenuPage from "./MenuPage.jsx";
import OffCampusPage from "./OffCampusPage.jsx";
import DetailPage from "./DetailPage.jsx";
import MyReviews from "./MyReviews.jsx";

const KAKAO_APP_KEY = "8668be1b8e7bcc2a3ba8e26af8f107c6";

export default function App() {
  const [page, setPage] = useState("home");
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

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            console.log("Kakao Maps API loaded.");
          });
        }
      };

      script.onerror = () => {
        console.error("Failed to load Kakao Maps API. Check your API key.");
      };

      document.head.appendChild(script);
    }
  }, []);

  // --- 1. 토큰 기반 로그인 유지 ---
  useEffect(() => {
    const fetchAuthData = async () => {
      if (token) {
        try {
          // 즐겨찾기 목록 가져오기
          const { data: favData } = await api.get(`${FAV_LIST}?page=0&size=10`);
          // 내 리뷰 목록 가져오기
          const { data: reviewData } = await api.get(REVIEWS_LIST);

          console.log("즐겨찾기 목록:", favData);
          console.log("내 리뷰 목록:", reviewData);

          setUser({ isLoggedIn: true });
          setFavorites(
            favData?.result?.restaurants?.map((r) => r.restaurantId) || []
          );
        } catch (error) {
          console.error("Token 기반 인증 실패:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setFavorites([]);
        }
      }
      setIsAuthReady(true);
    };
    fetchAuthData();
  }, [token]);

  useEffect(() => {
  if (localStorage.getItem("token")) {
    console.log("로그인 토큰 확인됨 — 식당 목록 로드 시작");
    fetchRestaurants();  // 로그인 되어 있으면 식당 목록 불러오기
  } else {
    console.log("토큰 없음 — 로그인 필요");
  }
}, []);

  // --- 2. 로그인 ---
  const login = async (email, password) => {
  try {
    const { data } = await api.post(AUTH_LOGIN, { email, password });
    const tokenFromServer = data.result?.accessToken;
    if (!tokenFromServer) throw new Error("토큰이 응답에 없습니다.");

    localStorage.setItem("token", tokenFromServer);
    setToken(tokenFromServer);

    // 바로 호출 대신 약간 지연 (JWT 인식 시간 확보용)
    setTimeout(async () => {
      try {
        const { data: favData } = await api.get(`${FAV_LIST}?page=0&size=10`);
        setFavorites(favData?.result?.restaurants?.map(r => r.restaurantId) || []);
        setUser({ isLoggedIn: true });
      } catch (innerErr) {
        console.warn("⚠️ 로그인 직후 즐겨찾기 로드 실패:", innerErr);
        setUser({ isLoggedIn: true }); // 그래도 로그인 상태로 처리
      }
    }, 500);

    alert("로그인 성공!");
    setPage("home");
  } catch (err) {
    console.error("로그인 오류:", err);
    alert(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
  }
};
  // --- 3. 회원가입 ---
  const signup = async (email, password) => {
    try {
      const { data } = await api.post(AUTH_SIGNUP, { email, password });
      const tokenFromServer = data.result?.accessToken;
      if (!tokenFromServer) throw new Error("토큰이 응답에 없습니다.");

      localStorage.setItem("token", tokenFromServer);
      setToken(tokenFromServer);
      alert("회원가입이 완료되었습니다.");
      setPage("home");
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  // --- 4. 찜 토글 ---
  const toggleFavorite = async (restaurantId, isFavorite) => {
  try {
    if (!token) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    // 찜 등록 or 해제 요청
    const { data } = await api.post("/api/bookmark", { restaurantId }); 
    console.log("찜 API 성공:", data);
  } catch (error) {
    console.error("❌ 찜 API 실패:", error);
  }
};

  // --- 5. 로그아웃 ---
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setFavorites([]);
    setPage("home");
  };

  // --- 6. 페이지 렌더링 ---
  const renderPage = () => {
    switch (page) {
      case "login": return <LoginPage setPage={setPage} />;
      case "signup": return <SignUpPage setPage={setPage} />;
      case "menu": return <MenuPage setPage={setPage} />;
      case "offcampus": return <OffCampusPage setPage={setPage} />;
      case "detail": return <DetailPage setPage={setPage} restaurantId={page.restaurantId} />;
      case "myreviews": return <MyReviews setPage={setPage} />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  // --- 7. AuthContext 값 ---
  const authContextValue = {
    user,
    isLoggedIn: !!user,
    favorites,
    login,
    signup,
    logout,
    toggleFavorite,
    showLoginModal: () => setPage("login"),
    setPage,
  };

  // --- 8. 로딩 화면 ---
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // --- 9. 최종 렌더 ---
  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="font-sans antialiased text-gray-800">
        <Header setPage={setPage} currentPage={page} />
<main className="relative z-10 min-h-screen">
  {renderPage()}
</main>
<Footer setPage={setPage} currentPage={page} />
      </div>
    </AuthContext.Provider>
  );
}
