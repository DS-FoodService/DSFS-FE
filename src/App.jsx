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

const FAKE_API_URL = '/api'; // 예시 URL

export default function App() {
    const [page, setPage] = useState('home');
    const [user, setUser] = useState(null); // { username: '...', email: '...' }
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [favorites, setFavorites] = useState([]);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // 앱 로드 시 토큰으로 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserWithToken = async () => {
            if (token) {
                try {
                    // 1. 토큰으로 사용자 정보 가져오기
                    const userRes = await fetch(`${FAKE_API_URL}/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!userRes.ok) throw new Error('Invalid token');
                    const userData = await userRes.json();
                    
                    // 2. '좋아요' 목록 가져오기
                    const favRes = await fetch(`${FAKE_API_URL}/favorites`, {
                         headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!favRes.ok) throw new Error('Could not fetch favorites');
                    const favData = await favRes.json(); // 예: { favorites: ['resto_1', 'resto_2'] }

                    // 3. 상태 설정
                    setUser(userData);
                    setFavorites(favData.favorites || []);
                } catch (error) {
                    console.error("Token login failed:", error);
                    // 토큰이 유효하지 않으면 비로그인 상태로
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    setFavorites([]);
                }
            }
            setIsAuthReady(true); // 인증 상태 확인 완료
        };
        fetchUserWithToken();
    }, [token]); // token이 변경될 때만 실행

    // 로그인 함수
    const login = async (email, password) => {
        const res = await fetch(`${FAKE_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || '로그인에 실패했습니다.');
        }
        const data = await res.json(); // { user: {...}, token: '...' }
        
        localStorage.setItem('token', data.token);
        setToken(data.token); // App.jsx의 useEffect 트리거
    };

    // 회원가입 함수
    const signup = async (username, email, password) => {
        const res = await fetch(`${FAKE_API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || '회원가입에 실패했습니다.');
        }
        const data = await res.json(); // { user: {...}, token: '...' }

        localStorage.setItem('token', data.token);
        setToken(data.token);
    };

    // 로그아웃 함수
    const logout = () => {
        console.log("로그아웃 실행");
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setFavorites([]);
        setPage('home'); // 로그아웃 후 홈으로
    };

    // '좋아요' 토글 함수
    const toggleFavorite = async (restaurantId, isCurrentlyFavorite) => {
        if (!token) return; // 로그인 상태가 아니면 중단

        try {
            const res = await fetch(`${FAKE_API_URL}/favorites/toggle`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ restaurantId })
            });

            if (!res.ok) throw new Error('Favorite toggle failed');

            // API 성공 시 프론트엔드 상태 즉시 업데이트
            if (isCurrentlyFavorite) {
                setFavorites(prev => prev.filter(id => id !== restaurantId));
            } else {
                setFavorites(prev => [...prev, restaurantId]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 현재 페이지에 따라 렌더링할 컴포넌트 결정
    const renderPage = () => {
        switch (page) {
            case 'login':
                return <LoginPage setPage={setPage} />;
            case 'signup':
                return <SignUpPage setPage={setPage} />;
            default:
                // 다른 페이지들(Menu, Offers 등)도 여기 case를 추가하여 구현
                return <HomePage setPage={setPage} />;
        }
    };

    // AuthContext에 제공할 값
    const authContextValue = {
        user: user,
        isLoggedIn: !!user, // user 객체가 있으면 로그인 상태
        favorites: favorites,
        login,
        signup,
        logout,
        toggleFavorite,
        showLoginModal: () => setPage('login'),
        setPage: setPage
    };

    if (!isAuthReady) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <div className="font-sans antialiased text-gray-800">
                {/* 로그인/회원가입 페이지가 아닐 때만 헤더와 푸터 표시 */}
                {page !== 'login' && page !== 'signup' && <Header setPage={setPage} />}
                <main>{renderPage()}</main>
                {page !== 'login' && page !== 'signup' && <Footer setPage={setPage} />}
            </div>
        </AuthContext.Provider>
    );
}