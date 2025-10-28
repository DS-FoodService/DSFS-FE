import React from 'react';
import { useAuth } from './AuthContext.jsx';

export const Header = ({ setPage }) => {
    const { user, isLoggedIn, logout } = useAuth();

    const handleProfileClick = () => {
        if (isLoggedIn) {
            // TODO: 사용자 페이지로 이동 또는 드롭다운 메뉴
            console.log("사용자 페이지로 이동 (구현 필요)");
            // 임시 로그아웃 (window.confirm 대신 커스텀 모달 필요)
             logout();
        } else {
            setPage('signup'); // 비로그인 시 회원가입 페이지로
        }
    };
    
    const handleSearchClick = () => {
        console.log("검색 클릭 (구현 필요)");
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <button onClick={() => setPage('home')} className="text-xl font-bold text-gray-800">
                    밥상나침반
                </button>

                <div className="hidden md:flex space-x-6">
                    {['Home', 'Menu', 'Offers', 'Service', 'About Us'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setPage(item.toLowerCase())}
                            className="text-gray-600 hover:text-lime-600 font-medium"
                        >
                            {item === 'Home' ? '홈' : item}
                        </button>
                    ))}
                    {/* 로그인 시 임시 로그아웃 버튼 (나중에 드롭다운으로 변경) */}
                    {isLoggedIn && (
                         <button
                            onClick={logout}
                            className="text-gray-600 hover:text-red-600 font-medium"
                        >
                            Logout
                        </button>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={handleSearchClick} className="text-gray-500 hover:text-lime-600" aria-label="검색">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                    <button onClick={handleProfileClick} className="w-8 h-8 rounded-full overflow-hidden bg-gray-200" aria-label="프로필">
                        {isLoggedIn && user?.photoURL ? ( // 백엔드에서 photoURL을 제공한다면
                             <img src={user.photoURL} alt="프로필" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export const Footer = ({ setPage }) => {
    return (
        <footer className="bg-gray-800 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">밥상나침반</h3>
                    <p className="text-sm mb-4">Food Dash ©2025 All Rights Reserved</p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-white">Social 1</a>
                        <a href="#" className="hover:text-white">Social 2</a>
                        <a href="#" className="hover:text-white">Social 3</a>
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Menu</h4>
                    <ul className="space-y-2">
                        <li><button onClick={() => setPage('home')} className="hover:text-white">Home</button></li>
                        <li><button onClick={() => setPage('offers')} className="hover:text-white">Offers</button></li>
                        <li><button onClick={() => setPage('service')} className="hover:text-white">Service</button></li>
                        <li><button onClick={() => setPage('about')} className="hover:text-white">About Us</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Information</h4>
                    <ul className="space-y-2">
                        <li><button onClick={() => setPage('menu')} className="hover:text-white">Menu</button></li>
                        <li><button onClick={() => setPage('quality')} className="hover:text-white">Quality</button></li>
                        <li><button onClick={() => setPage('choice')} className="hover:text-white">Make a Choice</button></li>
                        <li><button onClick={() => setPage('delivery')} className="hover:text-white">Fast Delivery</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                    <ul className="space-y-2 text-sm">
                        <li>+123 456 789</li>
                        <li>explore@fooddash.com</li>
                        <li>12, Maharashtra, Indian</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};