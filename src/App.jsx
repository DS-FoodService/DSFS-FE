import React, { useState, useEffect } from 'react';
// 1. AuthContext 파일 경로 (
import { AuthContext } from './AuthContext.jsx'; 

// 2. 레이아웃 파일 경로 
import { Header, Footer } from './Layout.jsx';

// 3. 페이지 파일 경로 
import HomePage from './Homepage.jsx';
import LoginPage from './login.jsx';
import SignUpPage from './Signin.jsx';

// --- export default function App() { ... } ---

<div className="bg-lime-300 text-lime-900 p-4 rounded-lg text-center font-bold mb-6">
  Tailwind 작동 확인 중 🍃
</div>

export default function App() {
  const [page, setPage] = useState('home'); 
  const [user, setUser] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [favorites, setFavorites] = useState([]); 
  const [isAuthReady, setIsAuthReady] = useState(false); 


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
      // [수정] 사용자 코드: case 'signup' 추가
      case 'signup': return <SignUpPage setPage={setPage} />; 
      // [수정] 사용자 코드: default에서 HomePage를 반환하도록 변경
      case 'home': 
      default: return <HomePage setPage={setPage} />; 
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
        <main>{renderPage()}</main>
        {page !== 'login' && page !== 'signup' && <Footer setPage={setPage} />}
      </div>
    </AuthContext.Provider>
  );
}