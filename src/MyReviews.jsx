import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api from "./api/client";
import { REVIEWS_LIST } from "./api/endpoints";

export default function MyReviews() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 페이지 로드 시 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchMyReviews = async () => {
      // 로그인 안 했으면 API 호출 안 함
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(REVIEWS_LIST, {
          params: {
            query: "all",
            page: 0,
            size: 100,
          }
        });
        console.log("✅ 리뷰 응답:", data);

        // ✅ 내 이메일로 작성한 리뷰만 필터링
        const allReviews = data?.result?.reviews || [];
        const myEmail = user?.email || localStorage.getItem("userEmail");
        const myReviews = allReviews.filter(r => r.author === myEmail);

        setReviews(myReviews);
      } catch (err) {
        console.error("❌ 리뷰 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReviews();
  }, [isLoggedIn, user]);

  // ✅ 로그인 안 했으면 로그인 유도
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-600">로그인이 필요합니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">내 리뷰 보기</h1>
      <p className="text-sm text-gray-500 mb-4">👤 {user?.email}</p>

      {reviews.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
          작성한 리뷰가 없습니다.
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.reviewId} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">⭐</span>
                <span className="font-semibold">{r.score}</span>
              </div>
              <p className="text-gray-700">{r.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
