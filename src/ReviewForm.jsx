import { useState } from "react";
import api from "./api/client";
import { REVIEW_CREATE } from "./api/endpoints";

export default function ReviewForm({ restaurantId, onCreated }) {
  const [content, setContent] = useState("");
  const [score, setScore] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post(REVIEW_CREATE, {
      restaurantId,
      content,
      score,
    });

    setContent("");
    onCreated?.(); // 리뷰 새로고침
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2"
        placeholder="리뷰를 작성하세요"
      />
      <button className="px-4 py-2 bg-lime-600 rounded-md text-white">
        등록
      </button>
    </form>
  );
}
