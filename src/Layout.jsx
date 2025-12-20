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
              {/* 드롭다운: pt-2로 hover 영역 확장 */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 hidden group-hover:block z-50">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <button onClick={() => navigate("/menu")} className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-lime-100">학식당</button>
                  <button onClick={() => navigate("/offcampus")} className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-lime-100">학교 밖 식당</button>
                  <button onClick={() => navigate("/myreviews")} className="block w-full text-left px-4 py-3 text-sm text-lime-700 hover:bg-lime-100">내 리뷰 보기</button>
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/about")} className="font-semibold text-gray-600 hover:text-lime-700">About Us</button>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/mypage")}
                  className="text-sm text-gray-700 hover:text-lime-700 cursor-pointer"
                >
                  👤 {user?.email || "User"}
                </button>
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


export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-800 text-gray-300 py-12"> {/* [수정] 사용자 코드: py-12로 패딩 통일 */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between gap-10">

        {/* 1. 밥상 */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-4 flex flex-col items-center lg:items-start lg:w-1/4">
          <h3 className="text-2xl font-bold text-white">밥상나침반</h3>
          <p className="text-sm">Food Dash ©2025 All Rights Reserved</p>
          {/* [추가] By Rim */}
          <p className="text-sm">By - Babsang </p>
          {/* Follow Us On */}
          <p className="text-lg font-semibold text-white mt-4">Follow Us On</p>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/duksung_babsang"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>

        {/* 2. Menu */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-3 flex flex-col items-center lg:items-start lg:w-1/4">
          <h4 className="text-xl font-semibold text-white mb-4">Menu</h4>
          {/* [수정] 사용자 코드: ul/li 대신 button 사용, 스타일 추가 */}
          <button onClick={() => navigate("/")} className="block hover:text-white transition-colors">Home</button>
          <button onClick={() => navigate("/menu")} className="block hover:text-white transition-colors">Menu</button>
          <button onClick={() => navigate("/about")} className="block hover:text-white transition-colors">About Us</button>
        </div>

        {/* 3. Information */}
        {/* [수정] 사용자 코드: flex, items-center/lg:items-start, lg:w-1/4 추가 */}
        <div className="space-y-3 flex flex-col items-center lg:items-start lg:w-1/4">
          <h4 className="text-xl font-semibold text-white mb-4">Information</h4>
          <button onClick={() => navigate("/menu")} className="block hover:text-white transition-colors">Menu</button>
          <button onClick={() => navigate("/offcampus")} className="block hover:text-white transition-colors">학교 밖 식당</button>
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