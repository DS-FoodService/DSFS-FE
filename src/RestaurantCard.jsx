import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const { favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  // 백엔드 응답 필드명에 맞춤
  const restaurantId = restaurant.restaurantId;
  const isFavorite = favorites.some(f => f.restaurantId === restaurantId);

  return (
    <div
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl p-5 cursor-pointer transition-transform hover:-translate-y-1"
      onClick={() => navigate(`/detail/${restaurantId}`)}
    >
      {/* 찜 버튼 (하트) */}
      <button
        className="absolute right-4 top-4"
        onClick={(e) => {
          e.stopPropagation(); // 카드 클릭과 구분
          toggleFavorite(restaurantId, isFavorite);
        }}
      >
        <img
          src={
            isFavorite
              ? "/assets/restaurants/heart-filled.png"
              : "/assets/restaurants/heart-empty.png"
          }
          alt="favorite-icon"
          className="w-6 h-6"
        />
      </button>

      {/* 카드 내용 */}
      <div className="flex flex-col items-center text-center gap-4">
        {/* 임시 이미지 (API에 이미지 없을 경우 기본 이미지 사용) */}
        <img
          src="/assets/restaurants/mainfood.png"
          className="rounded-full w-40 h-40 object-cover"
          alt={restaurant.name}
        />

        {/* 레스토랑 이름 */}
        <h3 className="font-bold text-xl text-gray-800">
          {restaurant.name}
        </h3>

        {/* 평점 + 리뷰 개수 */}
        <p className="text-gray-600 text-sm">
          ⭐ {restaurant.score ?? 0} ({restaurant.reviewCount ?? 0})
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
