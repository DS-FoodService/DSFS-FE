import { useState, useEffect } from 'react';

import api from './api/client';
import {
  AUTH_LOGIN, AUTH_SIGNUP, AUTH_ME,
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
  const fetchUserWithToken = async () => {
    if (token) {
      try {
        const { data: userData } = await api.get(AUTH_ME);
        const { data: favData }  = await api.get(FAV_LIST);
        setUser(userData);
        setFavorites(favData?.favorites || []);
      } catch (error) {
        console.error("Token login failed:", error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setFavorites([]);
      }
    }
    setIsAuthReady(true);
  };
  fetchUserWithToken();
}, [token]);

// 로그인 
const login = async (email, password) => {
  try {
    const { data } = await api.post(AUTH_LOGIN, { email, password });

    console.log("로그인 응답:", data); // ✅ 확인용 콘솔

    const tokenFromServer = data.result?.accessToken;
    if (!tokenFromServer) throw new Error("토큰이 응답에 없습니다.");

    localStorage.setItem("token", tokenFromServer);
    setToken(tokenFromServer);

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


const toggleFavorite = async (restaurantId) => {
  try {
    const { data } = await api.post(FAV_TOGGLE, { restaurantId });

    // 백엔드 응답 형식에 따라 반영
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );

  } catch (err) {
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