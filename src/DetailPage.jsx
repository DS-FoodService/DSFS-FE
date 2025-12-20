import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "./api/client";
import { AuthContext } from "./AuthContext";

export default function DetailPage() {
  const { restaurantId } = useParams();
  const { toggleFavorite, favorites } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    // 즐겨찾기 여부 표시
    setIsLiked(favorites.includes(Number(restaurantId)));
  }, [favorites, restaurantId]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get("/reviews", {
        params: {
          query: "restaurant",
          r_id: restaurantId,
          page,
          size,
        },
      });
      console.log("리뷰 응답:", data);
      setReviews(data.result?.reviews || []);
    } catch (err) {
      console.error("리뷰 목록 불러오기 실패:", err);
    }
  };

  const handleLikeClick = async () => {
    setIsLiked(!isLiked);
    await toggleFavorite(restaurantId);
    if (!isLiked) {
      await fetchReviews(); // ❤️ 찜하기 누를 때 리뷰 로드
    } else {
      setReviews([]); // 💔 해제 시 리뷰 비우기
    }
  };

  return (
    <div>
      <button onClick={handleLikeClick}>
        {isLiked ? "💔 찜 해제" : "❤️ 찜하기"}
      </button>

      {reviews.length > 0 && (
        <section>
          <h3>리뷰 목록</h3>
          <ul>
            {reviews.map((r) => (
              <li key={r.reviewId}>{r.content}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
