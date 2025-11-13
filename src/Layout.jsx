import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export const Header = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-lime-50/30 shadow-sm sticky top-0 z-50 backdrop-blur-md">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/assets/restaurants/밥상로고.png" className="w-14 h-14 object-contain" />
            <span className="text-2xl font-bold text-lime-800">Babsang</span>
          </div>

          <div className="flex space-x-8">
            <button onClick={() => navigate("/")} className="font-semibold text-gray-600 hover:text-lime-700">Home</button>
            <div className="relative group">
              <button className="font-semibold text-gray-600 hover:text-lime-700 flex items-center">
                Menu
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-50">
                <button onClick={() => navigate("/menu")} className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-lime-100">학식당</button>
                <button onClick={() => navigate("/offcampus")} className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-lime-100">학교 밖 식당</button>
                <button onClick={() => navigate("/myreviews")} className="block w-full text-left px-4 py-3 text-sm text-lime-700 hover:underline">내 리뷰 보기</button>
              </div>
            </div>
            <button onClick={() => navigate("/about")} className="font-semibold text-gray-600 hover:text-lime-700">About Us</button>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-700">{user?.email || "User"}</span>
                <button onClick={logout} className="text-sm font-semibold text-gray-600 hover:text-lime-700">로그아웃</button>
              </>
            ) : (
              <button onClick={() => navigate("/login")} className="text-sm font-semibold text-gray-600 hover:text-lime-700">로그인</button>
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
        
        {/* 1. 밥상 */}
<div className="space-y-4 flex flex-col items-center lg:items-start lg:w-1/4">
  <h3 className="text-2xl font-bold text-white">밥상</h3>
  <p className="text-sm">Food Dash ©2025 All Rights Reserved</p>
  <p className="text-sm">By - Babsang</p>

  <p className="text-lg font-semibold text-white mt-4">Follow Us On</p>

  {/* ✅ 인스타그램 아이콘 */}
  <div className="flex space-x-4">
    <a
      href="https://www.instagram.com/duksung_babsang/"
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 bg-gray-700 hover:bg-pink-600 rounded-full flex items-center justify-center text-white transition-colors"
      aria-label="duksung_babsang Instagram"
    >
      {/* 인스타그램 아이콘 (이모지나 아이콘 컴포넌트로 대체 가능) */}
      <i className="fab fa-instagram text-lg"></i>
      {/* 또는 단순 이모지: 📷 */}
      {/* 📷 */}
    </a>
  </div>
</div>


        {/* 2. Menu */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-3 flex flex-col items-center lg:items-start lg:w-1/4"> 
          <h4 className="text-xl font-semibold text-white mb-4">Menu</h4> 
          {/* [수정] 사용자 코드: ul/li 대신 button 사용, 스타일 추가 */}
          <button onClick={() => setPage('home')} className="block hover:text-white transition-colors">Home</button>
          <button onClick={() => setPage('menu')} className="block hover:text-white transition-colors">Menu</button>
          <button onClick={() => setPage('about')} className="block hover:text-white transition-colors">About Us</button>
        </div>

        {/* 3. Information */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-3 flex flex-col items-center lg:items-start lg:w-1/4"> 
          <h4 className="text-xl font-semibold text-white mb-4">Information</h4>
          <button onClick={() => setPage('menu')} className="block hover:text-white transition-colors">Menu</button>
          <button onClick={() => setPage('choice')} className="block hover:text-white transition-colors">Make a Choice</button>
        </div>
        
        {/* 4. Contact */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-3 flex flex-col items-center lg:items-start lg:w-1/4"> 
          <h4 className="text-xl font-semibold text-white mb-4">Contact</h4>
          {/* [수정] 사용자 코드: ul/li 대신 p 태그 사용, 원본 디자인 텍스트 */}
          <p>+123 456 7890</p>
          <p>Explore</p>
          <p>babsang@duksung.ac.kr</p>
          <p>Duksung Women's University</p>
        </div>
      </div>
    </footer>
  );
};