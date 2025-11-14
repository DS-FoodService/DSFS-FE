// src/RestaurantCard.jsx
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const { favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const restaurantId = restaurant.restaurantId;
  const isFavorite = favorites.includes(restaurantId);

  return (
    <div
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl p-5 cursor-pointer transition-transform hover:-translate-y-1"
      onClick={() => navigate(`/detail/${restaurantId}`)}
    >
      {/* 찜 버튼 */}
      <button
        className="absolute right-4 top-4"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(restaurantId);
        }}
        aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      >
        <img
          src={
            isFavorite
              ? "/assets/restaurants/heart-filled.png"
              : "/assets/restaurants/heart-empty.png"
          }
          alt={isFavorite ? "즐겨찾기됨" : "즐겨찾기 안됨"}
          className="w-6 h-6"
        />
      </button>

      {/* 카드 내용 */}
      <div className="flex flex-col items-center text-center gap-4">
        <img
          src="/assets/restaurants/mainfood.png"
          className="rounded-full w-40 h-40 object-cover"
          alt={restaurant.name}
        />
        <h3 className="font-bold text-xl text-gray-800">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm">
          ⭐ {restaurant.score ?? 0} ({restaurant.reviewCount ?? 0})
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
