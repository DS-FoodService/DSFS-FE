import { useState } from 'react';
import { useAuth } from "./AuthContext.jsx";
import { images } from "./data/images";

const SignUpPage = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const signupImg = images.find((img) => img.name === "log")?.src;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자리 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password); 
    } catch (err) {
      setError(err.message || "회원가입 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden m-4">

        {/* 왼쪽 이미지 */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={signupImg}
            alt="Signup Background"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "https://placehold.co/600x800/F0E7D8/333?text=Error")}
          />
        </div>

        {/* 오른쪽 form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <p className="text-sm font-semibold text-gray-500 mb-2">Sign Up</p>
          <h2 className="text-2xl font-bold text-lime-700 mb-4">Babsang.</h2>
          <h3 className="text-3xl font-bold text-gray-800 mb-8">Create Account</h3>

          <form onSubmit={handleSignUp} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition"
            >
              {loading ? "계정 생성 중..." : "Sign up"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?
              <button onClick={() => setPage("login")} className="font-medium text-lime-600 hover:text-lime-500 ml-1">
                Log in
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
