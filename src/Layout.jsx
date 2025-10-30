import React from 'react';
import { useAuth } from './AuthContext.jsx';

export const Header = ({ setPage }) => {
  const { user, isLoggedIn, logout } = useAuth(); // AuthContext 사용

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // TODO: 사용자 페이지 구현
      console.log("사용자 페이지로 이동 (구현 필요)");
      // setPage('profile'); 
    } else {
      setPage('signup'); // 비로그인 시 회원가입으로 (사용자 코드: 'signup')
    }
  };
  
  const handleSearchClick = () => {
    // TODO: 검색 기능 구현
    console.log("검색 클릭 (구현 필요)");
  };

  // [수정] 원본 디자인에 맞게 배경색, 그림자, sticky 등 스타일 추가/변경
  return (
    <header className="bg-lime-50/30 shadow-sm sticky top-0 z-50 backdrop-blur-md"> {/* [수정] 배경색, 그림자, 블러 효과 추가 */}
      {/* [수정] container, max-w-7xl, px 등 반응형 너비 설정 추가 */}
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> 
        {/* [수정] h-16 추가 (높이 고정) */}
        <div className="flex justify-between items-center h-16"> 
          {/* 로고 */}
          {/* [수정] 사용자 코드의 button 대신 div 사용, 스타일 변경 */}
          <div 
            onClick={() => setPage('home')} 
            className="text-2xl font-bold text-lime-800 cursor-pointer" 
          >
            밥상나침반 
          </div>

          {/* 네비게이션 메뉴 */}
          {/* [수정] 사용자 코드의 map 대신 직접 버튼 나열, 스타일 변경 */}
          <div className="flex space-x-8"> 
            {/* [수정] Home 버튼 추가 */}
            <button onClick={() => setPage('home')} className="font-semibold text-gray-600 hover:text-lime-700">Home</button> 
            <button onClick={() => setPage('menu')} className="font-semibold text-gray-600 hover:text-lime-700">Menu</button>
            <button onClick={() => setPage('offers')} className="font-semibold text-gray-600 hover:text-lime-700">Offers</button>
            <button onClick={() => setPage('service')} className="font-semibold text-gray-600 hover:text-lime-700">Service</button>
            <button onClick={() => setPage('about')} className="font-semibold text-gray-600 hover:text-lime-700">About Us</button>
            {/* [삭제] 사용자 코드의 임시 로그아웃 버튼 제거 */}
          </div>

          {/* 검색 및 프로필 아이콘 */}
          {/* [수정] 사용자 코드와 유사하나, 프로필 이미지 플레이스홀더 추가 및 스타일 변경 */}
          <div className="flex items-center space-x-4">
            <button onClick={handleSearchClick} className="text-gray-600 hover:text-lime-700" aria-label="검색"> {/* [수정] 스타일 변경 */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            {/* [수정] 프로필 버튼 스타일 변경 (크기, 테두리 등) */}
            <button onClick={handleProfileClick} className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-gray-400 hover:border-lime-500" aria-label="프로필"> 
              {/* [수정] 사용자 코드의 SVG 대신 img 사용, 로그인 상태 따라 이미지 변경 */}
              <img 
                src={isLoggedIn ? `https://placehold.co/40x40/A9C388/FFFFFF?text=${user?.username?.[0] || 'U'}` : 'https://placehold.co/40x40/E0E0E0/333?text=?'} 
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = 'https://placehold.co/40x40/E0E0E0/333?text=?'} 
              />
            </button>
             {/* [추가] 로그아웃 버튼 (넓은 화면에만 표시) */}
            {isLoggedIn && (
              <button onClick={logout} className="hidden md:block text-sm font-semibold text-gray-600 hover:text-lime-700">
                로그아웃
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export const Footer = ({ setPage }) => {
  // [수정] 사용자 코드 기반 + flex/정렬 수정 (이전 답변 내용)
  return (
    <footer className="bg-gray-800 text-gray-300 py-12"> {/* [수정] 사용자 코드: py-12로 패딩 통일 */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between gap-10">
        
        {/* 1. 밥상나침반 */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-4 flex flex-col items-center lg:items-start lg:w-1/4"> 
          <h3 className="text-2xl font-bold text-white">밥상나침반</h3>
          <p className="text-sm">Food Dash ©2025 All Rights Reserved</p>
          {/* [추가] By Rim */}
          <p className="text-sm">By - Rim (개발자 이름)</p> 
          {/* [추가] Follow Us On */}
          <p className="text-lg font-semibold text-white mt-4">Follow Us On</p> 
          {/* [수정] 사용자 코드의 a 태그 대신 임시 아이콘 */}
          <div className="flex space-x-4"> 
            <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">?</span>
            <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">?</span>
            <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">?</span>
          </div>
        </div>

        {/* 2. Menu */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-3 flex flex-col items-center lg:items-start lg:w-1/4"> 
          <h4 className="text-xl font-semibold text-white mb-4">Menu</h4> 
          {/* [수정] 사용자 코드: ul/li 대신 button 사용, 스타일 추가 */}
          <button onClick={() => setPage('home')} className="block hover:text-white transition-colors">Home</button>
          <button onClick={() => setPage('menu')} className="block hover:text-white transition-colors">Menu</button>
          <button onClick={() => setPage('offers')} className="block hover:text-white transition-colors">Offers</button>
          <button onClick={() => setPage('service')} className="block hover:text-white transition-colors">Service</button>
          <button onClick={() => setPage('about')} className="block hover:text-white transition-colors">About Us</button>
        </div>

        {/* 3. Information */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-3 flex flex-col items-center lg:items-start lg:w-1/4"> 
          <h4 className="text-xl font-semibold text-white mb-4">Information</h4>
          <button onClick={() => setPage('menu')} className="block hover:text-white transition-colors">Menu</button>
          <button onClick={() => setPage('quality')} className="block hover:text-white transition-colors">Quality</button>
          <button onClick={() => setPage('choice')} className="block hover:text-white transition-colors">Make a Choice</button>
          <button onClick={() => setPage('delivery')} className="block hover:text-white transition-colors">Fast Delivery</button>
        </div>
        
        {/* 4. Contact */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-3 flex flex-col items-center lg:items-start lg:w-1/4"> 
          <h4 className="text-xl font-semibold text-white mb-4">Contact</h4>
          {/* [수정] 사용자 코드: ul/li 대신 p 태그 사용, 원본 디자인 텍스트 */}
          <p>+123 456 7890</p>
          <p>Explore</p>
          <p>Info@Fooddash.com</p>
          <p>12, Maharashtra, Indian</p>
        </div>
      </div>
    </footer>
  );
};