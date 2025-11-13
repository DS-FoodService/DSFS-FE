import { useEffect, useState } from "react";
import api from "./api/client";
import { REVIEWS_LIST } from "./api/endpoints";

export default function MyReviews() {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">내 리뷰 보기</h1>
      {reviews.length === 0 ? (
        <p>등록된 리뷰가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.reviewId} className="border-b pb-2">
              <p className="font-semibold">⭐ {r.score}</p>
              <p>{r.content}</p>
              <p className="text-sm text-gray-500">
                {r.author} | {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
