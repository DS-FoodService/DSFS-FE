import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "./api/client";
import { AuthContext } from "./AuthContext";

export default function DetailPage() {
  const { restaurantId: paramId } = useParams();
  const { toggleFavorite, favorites, isLoggedIn } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [page] = useState(0);
  const [size] = useState(10);

  // ✅ restaurantId 안전하게 처리
  const restaurantId = paramId || null;

  const emptyStar = "/star_empty.png";
  const filledStar = "/star_filled.png";

  useEffect(() => {
    if (restaurantId) {
      setIsLiked(favorites.includes(Number(restaurantId)));
    }
  }, [favorites, restaurantId]);

  // ✅ 리뷰 불러오기 함수
  const fetchReviews = async () => {
    if (!restaurantId) {
      console.warn("⚠️ restaurantId가 없습니다. 리뷰 요청 중단");
      return;
    }

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
      if (err.response?.status === 401) {
        console.warn("로그인 필요 - 리뷰를 보려면 로그인하세요.");
      } else {
        console.error("리뷰 목록 불러오기 실패:", err);
      }
    }
  };

  // ✅ 페이지 진입 시 리뷰 자동 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      fetchReviews();
    }
  }, [restaurantId, isLoggedIn]);

  // ✅ 찜 버튼 클릭
  const handleLikeClick = async () => {
    if (!restaurantId) return;
    setIsLiked((prev) => !prev);
    try {
      await toggleFavorite(Number(restaurantId));
    } catch (error) {
      console.error("찜 토글 실패:", error);
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

      {/* ✅ 로그인 안 한 경우 */}
      {!isLoggedIn && (
        <p style={{ marginTop: "20px", color: "#666" }}>
          리뷰를 보거나 작성하려면 로그인하세요.
        </p>
      )}

      {/* ✅ 리뷰 섹션 */}
      {isLoggedIn && reviews.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>리뷰 목록</h3>
          <ul>
            {reviews.map((review) => (
              <li key={review.reviewId}>{review.content}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ 리뷰 없음 */}
      {isLoggedIn && reviews.length === 0 && (
        <p style={{ marginTop: "20px", color: "#777" }}>
          아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
        </p>
      )}
    </div>
  );
}
