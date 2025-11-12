// ✅ DetailPage.jsx
import { useEffect, useState } from "react";
import api from "./api/client";
import { useAuth } from "./AuthContext";
import { RESTAURANT_LIST, REVIEWS_LIST } from "./api/endpoints";
import ReviewForm from "./ReviewForm.jsx";

export default function DetailPage({ restaurantId, setPage }) {
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);

  const { favorites, toggleFavorite } = useAuth();
  const isFavorite = favorites.includes(restaurantId);

  // ✅ 식당 상세정보 불러오기
  const fetchRestaurantDetail = async () => {
    try {
      const { data } = await api.get(`/restaurants/${restaurantId}`);
      console.log("✅ 상세페이지 데이터:", data);

      setRestaurant(data.result.restaurant);
      setMenus(data.result.menus);
    } catch (err) {
      console.error("❌ 상세페이지 불러오기 실패:", err);
    }
  };

  // ✅ 리뷰 목록 불러오기
  const fetchReviews = async () => {
    try {
      const { data } = await api.get(REVIEWS_LIST, {
        params: { restaurantId },
      });
      console.log("✅ 리뷰 응답:", data);
      setReviews(data.result?.reviews || []);
    } catch (err) {
      console.error("❌ 리뷰 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchRestaurantDetail();
    fetchReviews();
  }, [restaurantId]);

  // ✅ 카카오 지도 표시
  useEffect(() => {
    if (restaurant && window.kakao && window.kakao.maps) {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(
          restaurant.latitude,
          restaurant.longitude
        ),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          restaurant.latitude,
          restaurant.longitude
        ),
      });
      marker.setMap(map);
    }
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12 space-y-10">
      {/* 🔙 뒤로가기 */}
      <button className="text-lime-600" onClick={() => setPage("home")}>
        ← Back
      </button>

      {/* ✅ 가게 이름 + 찜 버튼 */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{restaurant.name}</h1>
        <button onClick={() => toggleFavorite(restaurantId, isFavorite)}>
          <img
            src={
              isFavorite
                ? "/assets/restaurants/heart-filled.png"
                : "/assets/restaurants/heart-empty.png"
            }
            alt="favorite"
            className="w-8 h-8"
          />
        </button>
      </div>

      <p className="text-lg text-gray-700">
        ⭐ {restaurant.score} ({restaurant.reviewCount} reviews)
      </p>

      {/* ✅ 지도 */}
      <div id="map" className="w-full h-80 rounded-xl shadow-md"></div>

      {/* ✅ 메뉴 리스트 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">메뉴</h2>
        <div className="space-y-4">
          {menus.length === 0 ? (
            <p className="text-gray-500">등록된 메뉴가 없습니다.</p>
          ) : (
            menus.map((menu) => (
              <div
                key={menu.menuId}
                className="flex justify-between p-4 bg-white rounded-lg shadow"
              >
                <div>
                  <h3 className="font-bold">{menu.name}</h3>
                  <p className="text-sm text-gray-600">{menu.info}</p>
                </div>
                <div className="text-right font-semibold text-gray-700">
                  ₩ {menu.price.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ✅ 리뷰 섹션 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">리뷰</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">아직 등록된 리뷰가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.reviewId}
                className="p-4 bg-white rounded-lg shadow space-y-1"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">
                    {rev.user?.email || "익명"}
                  </span>
                  <span className="text-sm text-gray-500">⭐ {rev.score}</span>
                </div>
                <p className="text-gray-700">{rev.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* ✅ 리뷰 작성 폼 */}
        <ReviewForm restaurantId={restaurantId} onReviewAdded={fetchReviews} />
      </section>
    </div>
  );
}
