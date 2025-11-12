import { useEffect, useState } from "react";
import api from "./api/client";
import { REVIEWS_LIST } from "./api/endpoints";

export default function MyReviews({ setPage }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const { data } = await api.get(REVIEWS_LIST);
        console.log("✅ 내 리뷰 응답:", data);
        setReviews(data?.result?.reviews || []);
      } catch (err) {
        console.error("❌ 리뷰 조회 실패:", err);
      }
    };
    fetchMyReviews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => setPage("home")}
        className="text-lime-600 hover:underline"
      >
        ← 홈으로 돌아가기
      </button>

      {/* 제목 */}
      <h1 className="text-3xl font-bold">내가 작성한 리뷰</h1>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <p className="text-gray-500">아직 작성한 리뷰가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li
              key={r.reviewId}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{r.author}</span>
                <span className="text-yellow-500">⭐ {r.score}</span>
              </div>
              <p className="mt-2 text-gray-700">{r.content}</p>
              <p className="text-sm text-gray-400">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
