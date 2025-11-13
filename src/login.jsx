// src/LoginPage.jsx
import React, { useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom"; 
import { images } from "./data/images"; // 자동 이미지 import

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();  // 라우터용 네비게이터

  /** 이미지 찾기: log.png */
  const loginBg =
    images.find((img) => img.name === "log" || img.id === "img_log")?.src ||
    "/assets/log.png";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ App.jsx의 login 함수에 navigate 전달
      await login(email, password, navigate);
    } catch (err) {
      console.error("로그인 실패:", err);
      setError(err.message || "로그인 실패!");
      navigate("/signup"); // ✅ 로그인 실패 → 회원가입 페이지로 이동
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden m-4">

        {/* ✅ 왼쪽 이미지 */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={loginBg}
            alt="Login Side Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 오른쪽 로그인 form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <p className="text-sm font-semibold text-gray-500 mb-2">Log In</p>
          <h2 className="text-2xl font-bold text-lime-700 mb-4">Babsang.</h2>
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Welcome Back!</h3>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "Log In"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}  // ✅ 수정된 부분
                className="font-medium text-lime-600 hover:text-lime-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
