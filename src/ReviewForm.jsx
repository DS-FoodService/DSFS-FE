import { useState } from "react";
import api from "./api/client";

export default function ReviewForm({ restaurantId, onReviewAdded }) {
  const [content, setContent] = useState("");
  const [score, setScore] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", {
        restaurantId,
        content,
        score,
      });
      setContent("");
      setScore(5);
      alert("리뷰가 등록되었습니다!");
      onReviewAdded?.(); // 작성 후 목록 새로고침
    } catch (err) {
      console.error("❌ 리뷰 작성 실패:", err);
      alert("리뷰 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-6">
      <div>
        <label className="font-semibold text-gray-700">별점:</label>
        <select
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="ml-2 border rounded-md p-1"
        >
          {[5, 4, 3, 2, 1].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="리뷰를 작성해주세요"
        className="w-full border rounded-md p-3"
        rows="4"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700"
      >
        등록
      </button>
    </form>
  );
}
