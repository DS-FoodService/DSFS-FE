// src/LoginPage.jsx
import React, { useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { images } from "./data/images";   // ✅ 자동 이미지 import

const LoginPage = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // ✅ images.js 에서 id가 "login-bg" 인 이미지 찾기
  const loginBg = images.find((img) => img.id === "login-bg")?.src;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setPage("home");   // ✅ 로그인 성공하면 홈으로 이동
    } catch (err) {
      setError(err.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden m-4">

        {/* ✅ 왼쪽 이미지 영역 */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={loginBg}
            alt="Login Background"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "https://placehold.co/600x800/F0E7D8/333?text=Error")}
          />
        </div>

        {/* ✅ 오른쪽 로그인 form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <p className="text-sm font-semibold text-gray-500 mb-2">Log In</p>
          <h2 className="text-2xl font-bold text-lime-700 mb-4">Babsang.</h2>
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Welcome Back!</h3>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="login-email">
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="login-password">
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

            {/* Error */}
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
              <button onClick={() => setPage("signup")} className="font-medium text-lime-600 hover:text-lime-500">
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
