import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./AuthContext";
import { Header, Footer } from "./Layout.jsx";

import HomePage from "./Homepage.jsx";
import LoginPage from "./login.jsx";
import SignUpPage from "./Signin.jsx";
import MenuPage from "./MenuPage.jsx";
import OffCampusPage from "./OffCampusPage.jsx";
import DetailPage from "./DetailPage.jsx";
import MyReviews from "./MyReviews.jsx";
import MyPage from "./MyPage.jsx";

const KAKAO_APP_KEY = "8668be1b8e7bcc2a3ba8e26af8f107c6";

export default function App() {
  // --- 카카오 지도 로드 ---
  useEffect(() => {
    if (!document.getElementById("kakao-maps-script")) {
      const script = document.createElement("script");
      script.id = "kakao-maps-script";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing&autoload=false`;
      script.async = true;
      script.onload = () => window.kakao?.maps?.load(() => console.log("Kakao Maps API loaded."));
      document.head.appendChild(script);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="relative z-10 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/offcampus" element={<OffCampusPage />} />
            <Route path="/detail/:restaurantId" element={<DetailPage />} />
            <Route path="/myreviews" element={<MyReviews />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

