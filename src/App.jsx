import { useState, useEffect } from 'react';

import api from './api/client';
import {
  AUTH_LOGIN, AUTH_SIGNUP,
  FAV_LIST, FAV_TOGGLE,
} from './api/endpoints';

import { AuthContext } from "./AuthContext.jsx";

// 2. 레이아웃 파일 경로 
import { Header, Footer } from './Layout.jsx';

// 3. 페이지 파일 경로 
import HomePage from './Homepage.jsx';
import LoginPage from './login.jsx';
import SignUpPage from './Signin.jsx';
import MenuPage from './MenuPage.jsx';
import OffCampusPage from './OffCampusPage.jsx';
import DetailPage from "./DetailPage.jsx";
import MyReviews from "./MyReviews.jsx";

//import { KAKAO_APP_KEY } from './AuthContext.jsx';
const FAKE_API_URL = '/api'; 
const KAKAO_APP_KEY = '8668be1b8e7bcc2a3ba8e26af8f107c6';

// --- export default function App() { ... } ---

export default function App() {
  const [page, setPage] = useState('home'); 
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [favorites, setFavorites] = useState([]); 
  const [isAuthReady, setIsAuthReady] = useState(false); 

// --- 0. 카카오지도
  useEffect(() => {
    if (!document.getElementById('kakao-maps-script')) {
      const script = document.createElement('script');
      script.id = 'kakao-maps-script';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing&autoload=false`;
      script.async = true;
      
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            console.log('Kakao Maps API loaded.');
          });
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load Kakao Maps API. Check your API key.");
      };
      
      document.head.appendChild(script);
    }
  }, []);

  // --- 1. 인증 관련 로직
useEffect(() => {
  const fetchAuthData = async () => {
    if (token) {
      try {
        // 토큰이 있으면 즐겨찾기 & 리뷰 목록을 불러와 인증 확인
        const { data: favData } = await api.get(FAV_LIST);
        const { data: reviewData } = await api.get(REVIEWS_LIST);

        // 성공 시 유저를 “로그인된 상태”로 인식
        setUser({ isLoggedIn: true });
        setFavorites(
          favData?.result?.restaurants?.map((r) => r.restaurantId) || []
        );

        console.log("즐겨찾기 목록:", favData);
        console.log("내 리뷰 목록:", reviewData);
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

// 로그인 
const login = async (email, password) => {
  try {
    const { data } = await api.post(AUTH_LOGIN, { email, password });
    console.log("로그인 응답:", data);

    // 서버 응답 구조에 맞게 accessToken 가져오기
    const tokenFromServer = data.result?.accessToken;

    if (!tokenFromServer) {
      throw new Error("로그인 응답에 토큰이 없습니다.");
    }

    // 토큰 저장
    localStorage.setItem("token", tokenFromServer);
    setToken(tokenFromServer);

 const { data: favData } = await api.get(FAV_LIST);
    setUser({ isLoggedIn: true });
    setFavorites(
      favData?.result?.restaurants?.map((r) => r.restaurantId) || []
    );

    alert("로그인 성공!");
    setPage("home");
  } catch (err) {
    console.error("로그인 오류:", err);
    alert(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
  }
};

// 회원가입 
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

//가게 목록 찜하기 조회
const toggleFavorite = async (restaurantId) => {
  try {
    await api.post(`${FAV_TOGGLE}/${restaurantId}`);
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  } catch (err) {
    console.error("❌ 찜 API 실패:", err);
    alert("로그인 후 이용해주세요.");
  }
};


  // --- 2. 페이지 렌더링 로직 (사용자 코드와 동일) ---
  const renderPage = () => {
    switch (page) {
      case 'login': return <LoginPage setPage={setPage} />;
      // 회원가입
      case 'signup': return <SignUpPage setPage={setPage} />; 
      // default에서 HomePage를 반환하도록 변경
      case 'home': 
      default: return <HomePage setPage={setPage} />; 
      case 'menu':  // 메뉴페이지
      return <MenuPage setPage={setPage} />;
      case 'offcampus':
      return <OffCampusPage setPage={setPage} />; 
      case 'detail':                            
      return <DetailPage setPage={setPage} restaurantId={page.restaurantId} />;
      case "myreviews": return <MyReviews setPage={setPage} />;
      
    }
  };

 const logout = () => {
  localStorage.removeItem('token');
  setToken(null);
  setUser(null);
  setFavorites([]);
  setPage('home');
};

  // AuthContext에 제공할 값 (사용자 코드와 동일)
  const authContextValue = {
    user: user, isLoggedIn: !!user, favorites: favorites,
    login, signup, logout, toggleFavorite,
    showLoginModal: () => setPage('login'),
    setPage: setPage
  };

  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>; // 사용자 코드와 동일
  }

  // --- 3. 최종 JSX 렌더링 (사용자 코드와 동일) ---
 return (
    <AuthContext.Provider value={authContextValue}>
      <div className="font-sans antialiased text-gray-800">
        {page !== 'login' && page !== 'signup' && <Header setPage={setPage} />}
        {/* [수정] z-index 수정 */}
        <main className="relative z-10">{renderPage()}</main> 
        {page !== 'login' && page !== 'signup' && <Footer setPage={setPage} />}
      </div>
    </AuthContext.Provider>
  );
}