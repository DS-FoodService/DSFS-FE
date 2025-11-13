import { useEffect, useState } from 'react';
import api from "./api/client";
import { REVIEWS_LIST } from "./api/endpoints";

export default function ReviewList({ restaurantId }) {
  const [items, setReviews] = useState([]);

   useEffect(() => {
    const loadReviews = async () => {
      const res = await api.get(`${REVIEWS_LIST}?query=restaurant&page=0&size=10`);

      // ✅ swagger 대응 (res.data.result.reviews)
      setReviews(res.data.result.reviews);
    };
    loadReviews();
  }, [restaurantId]);

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.reviewId} className="p-3 border rounded-md bg-gray-50">
          <p className="font-semibold">{r.author}</p>
          <p>{r.content}</p>
          <span className="text-sm text-gray-500">{r.createdAt}</span>
        </div>
      ))}
    </div>
  );
}