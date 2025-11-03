import { useState, useEffect } from 'react';
// 1. AuthContext 파일 경로 (
import { AuthContext } from './AuthContext.jsx'; 

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
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing&autoload=false`;
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

  // --- 1. 인증 관련 로직 (사용자 코드와 동일) ---
  useEffect(() => {
    const fetchUserWithToken = async () => {
      if (token) {
        try {
          const userRes = await fetch(`${FAKE_API_URL}/me`, { headers: { 'Authorization': `Bearer ${token}` }});
          if (!userRes.ok) throw new Error('Invalid token');
          const userData = await userRes.json();
          const favRes = await fetch(`${FAKE_API_URL}/favorites`, { headers: { 'Authorization': `Bearer ${token}` }});
          if (!favRes.ok) throw new Error('Could not fetch favorites');
          const favData = await favRes.json();
          setUser(userData);
          setFavorites(favData.favorites || []);
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

  const login = async (email, password) => {
    const res = await fetch(`${FAKE_API_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!res.ok) { const err = await res.json(); throw new Error(err.message || '로그인 실패'); }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token); 
  };

  const signup = async (username, email, password) => {
    const res = await fetch(`${FAKE_API_URL}/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) });
    if (!res.ok) { const err = await res.json(); throw new Error(err.message || '회원가입 실패'); }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setFavorites([]);
    setPage('home'); 
  };

  const toggleFavorite = async (restaurantId, isCurrentlyFavorite) => {
    if (!token) return; 
    try {
      const res = await fetch(`${FAKE_API_URL}/favorites/toggle`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ restaurantId }) });
      if (!res.ok) throw new Error('Favorite toggle failed');
      if (isCurrentlyFavorite) { setFavorites(prev => prev.filter(id => id !== restaurantId)); } 
      else { setFavorites(prev => [...prev, restaurantId]); }
    } catch (error) { console.error(error); }
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