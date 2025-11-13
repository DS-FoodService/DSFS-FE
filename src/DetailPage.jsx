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

  // ✅ public 폴더에 있는 별 이미지 경로
  const emptyStar = "/star_empty.png";   // 빈 별
  const filledStar = "/star_filled.png"; // 찜한 별

  // ⭐ 초기 찜 상태 설정 (favorites 목록에 해당 식당이 포함되어 있으면 true)
  useEffect(() => {
    setIsLiked(favorites.includes(Number(restaurantId)));
  }, [favorites, restaurantId]);

  // ✅ 리뷰 불러오기 함수
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

  // ✅ 페이지 진입 시 리뷰 자동 불러오기
  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  // ✅ 찜 버튼 클릭 이벤트
  const handleLikeClick = async () => {
    // UI를 즉시 변경해서 새로고침 없이 별 모양 바꾸기
    setIsLiked((prev) => !prev);

    try {
      await toggleFavorite(restaurantId);
    } catch (error) {
      console.error("찜 토글 실패:", error);
      // API 실패 시 UI 롤백
      setIsLiked((prev) => !prev);
    }
  };

  return (
    <div className="detail-page" style={{ padding: "20px" }}>
      {/* ⭐ 찜 버튼 */}
      <img
        src={isLiked ? filledStar : emptyStar}
        alt="찜 버튼"
        onClick={handleLikeClick}
        style={{
          width: "36px",
          height: "36px",
          cursor: "pointer",
          transition: "transform 0.15s ease-in-out",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
      />

      {/* ✅ 리뷰 섹션 */}
      {reviews.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>리뷰 목록</h3>
          <ul>
            {reviews.map((review) => (
              <li key={review.reviewId}>{review.content}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
