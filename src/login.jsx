import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const LoginPage = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // [수정] 사용자 코드: 초기값 null -> ''
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => { // [수정] 사용자 코드: 함수명 handleLogin으로 통일
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setPage('home'); 
    } catch (err) {
      setError(err.message || '로그인 중 오류 발생'); // [수정] 사용자 코드: 에러 메시지 보강
    } finally {
      setLoading(false);
    }
  };

  // [수정] 사용자 코드: 전체 구조를 원본 디자인(좌/우 분리, 스타일)으로 변경
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden m-4"> {/* [수정] m-4 추가 */}
        {/* 왼쪽 이미지 */}
        <div className="hidden md:block md:w-1/2">
          {/* TODO: 원본 이미지로 교체 */}
          <img 
            src="https://placehold.co/600x800/F0E7D8/333?text=Login+Image" 
            alt="Food" 
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = 'https://placehold.co/600x800/F0E7D8/333?text=Error'}
          />
        </div>
        {/* 오른쪽 폼 */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
           {/* [수정] 디자인에 맞게 제목 구조 변경 */}
          <p className="text-sm font-semibold text-gray-500 mb-2">Log In</p> 
          <h2 className="text-2xl font-bold text-gray-800 mb-4">FoodDash.</h2>
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Welcome Back!</h3> 
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="login-email">
                Email Address
              </label>
              {/* [수정] 사용자 코드: input 스타일 변경 (둥근 모서리, 포커스 효과) */}
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Youraddress@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="login-password">
                Password
              </label>
              {/* [수정] 사용자 코드: input 스타일 변경 */}
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

            {/* [수정] 사용자 코드: 버튼 스타일 변경 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? '로그인 중...' : 'Log In'}
            </button>
          </form>

          {/* [수정] 사용자 코드: 회원가입 버튼 스타일 변경 */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => setPage('signup')} className="font-medium text-lime-600 hover:text-lime-500">
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