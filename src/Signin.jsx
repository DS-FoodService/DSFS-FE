import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const SignUpPage = ({ setPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth(); //useAuth 파일 안에 정의
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password || !username) {
            setError("모든 필드를 입력해주세요.");
            return;
        }
        setLoading(true);
        try {
            await signup(username, email, password); // API 호출
            setPage('home'); // 회원가입 성공 시 홈으로
        } catch (err) {
            setError(err.message);
            console.error("Sign up error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col w-full max-w-4xl m-4 overflow-hidden bg-white shadow-2xl md:flex-row rounded-2xl">
                <div className="hidden md:block md:w-1/2">
                    <img
                        src="https://placehold.co/600x800/DEE9F3/333?text=음식+배경+이미지"
                        alt="Food background"
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="w-full p-8 md:w-1/2 md:p-12">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">Food Dash.</h2>
                    <hr className="w-16 mb-8 border-t-4 border-orange-500" />
                    <h3 className="mb-6 text-3xl font-bold text-gray-900">Create Account</h3>
                    <form onSubmit={handleSignUp} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-500" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full px-4 py-3 border-b-2 border-gray-200 focus:outline-none focus:border-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-500" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Youraddress@email.com"
                                className="w-full px-4 py-3 border-b-2 border-gray-200 focus:outline-none focus:border-orange-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-500" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border-b-2 border-gray-200 focus:outline-none focus:border-orange-500"
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 font-bold text-white transition-colors bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                            {loading ? '계정 생성 중...' : 'Login to Continue'}
                        </button>
                    </form>
                    <div className="my-6 text-sm text-center text-gray-500">
                        Already have an account?{' '}
                        <button onClick={() => setPage('login')} className="font-semibold text-orange-500 hover:underline">
                            Log in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;