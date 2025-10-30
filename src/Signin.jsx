import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
const SignUpPage = ({ setPage }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignUp = async (e) => { // [수정] 사용자 코드: 함수명 handleSignUp으로 통일
    e.preventDefault();
    setError('');
    // [수정] 사용자 코드: 유효성 검사 순서 변경
    if (!username || !email || !password) { 
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (password.length < 6) { // [추가] 비밀번호 길이 검사
        setError('비밀번호는 6자리 이상이어야 합니다.');
        return;
    }
    setLoading(true);
    try {
      await signup(username, email, password);
      setPage('home'); 
    } catch (err) {
      setError(err.message || '회원가입 중 오류 발생'); // [수정] 사용자 코드: 에러 메시지 보강
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
            src="https://placehold.co/600x800/C8E6C9/333?text=Sign+Up+Image" 
            alt="Food" 
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = 'https://placehold.co/600x800/C8E6C9/333?text=Error'}
          />
        </div>
        
        {/* 오른쪽 폼 */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          {/* [수정] 디자인에 맞게 제목 구조 변경 */}
          <p className="text-sm font-semibold text-gray-500 mb-2">Sign Up</p> 
          <h2 className="text-2xl font-bold text-gray-800 mb-4">FoodDash.</h2> 
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Create Account</h3>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="username">
                Username
              </label>
              {/* [수정] 사용자 코드: input 스타일 변경 */}
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              {/* [수정] 사용자 코드: input 스타일 변경 */}
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="Youraddress@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              {/* [수정] 사용자 코드: input 스타일 변경 */}
              <input
                id="password"
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
              {/* [수정] 사용자 코드: 버튼 텍스트 변경 */}
              {loading ? '계정 생성 중...' : 'Login to Continue'} 
            </button>
          </form>

          {/* [수정] 사용자 코드: 로그인 버튼 스타일 변경 */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={() => setPage('login')} className="font-medium text-lime-600 hover:text-lime-500">
                Log in
              </button>
            </p>
          </div>
          
          {/* [추가] 소셜 로그인 구분선 및 버튼 (원본 디자인 참고) */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">Or login with</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              {/* TODO: 구글 로고 SVG/Img */}
              <span className="w-5 h-5 bg-red-200 rounded-full">G</span>
              Login with Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              {/* TODO: 페이스북 로고 SVG/Img */}
              <span className="w-5 h-5 bg-blue-200 rounded-full">f</span>
              Login with Facebook
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUpPage;