import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

// 아이콘 매핑
const ICON_MAP = {
  halal: "/assets/restaurants/halal.png",
  gluten_free: "/assets/restaurants/gluten.png",
  gluten: "/assets/restaurants/gluten.png",
  byo: "/assets/restaurants/byo.png",
  local: "/assets/restaurants/local.png",
  vegan: "/assets/restaurants/vegan.png",
};

// 기본 아이콘 (태그가 없을 때 표시)
const DEFAULT_ICONS = ["halal", "gluten", "byo", "local"];

const RestaurantCard = ({ restaurant }) => {
  const { favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  // 백엔드 응답 필드명에 맞춤
  const restaurantId = restaurant.restaurantId;
  const isFavorite = favorites.some(f => f.restaurantId === restaurantId);

  // 식당 태그 또는 기본 아이콘
  const displayTags = restaurant.tags?.length > 0 ? restaurant.tags : DEFAULT_ICONS;

  return (
    <div
      className="relative rounded-3xl p-6 hover:shadow-lg transition-all duration-300"
      style={{ backgroundColor: '#FDFFE5' }}
    >
      {/* 찜 버튼 (별 모양) - 왼쪽 상단 */}
      <button
        className="absolute left-4 top-4 z-10"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(restaurantId, isFavorite);
        }}
      >
        <span
          className="text-2xl"
          style={{ color: isFavorite ? '#C9D267' : '#E0E0E0' }}
        >
          {isFavorite ? "★" : "☆"}
        </span>
      </button>

      {/* 카드 클릭 영역 */}
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/detail/${restaurantId}`)}
      >
        {/* 이미지 컨테이너 - 점선 원형 테두리 */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* 점선 원형 테두리 */}
            <div
              className="w-40 h-40 rounded-full border-4 border-dashed flex items-center justify-center"
              style={{ borderColor: '#C9D267' }}
            >
              <img
                src="/assets/restaurants/mainfood.png"
                className="rounded-full w-32 h-32 object-cover"
                alt={restaurant.name}
              />
            </div>
          </div>
        </div>

        {/* 식당 정보 */}
        <div className="text-left space-y-2">
          {/* 레스토랑 이름 */}
          <h3 className="font-bold text-lg text-gray-800">
            {restaurant.name}
          </h3>

          {/* 평점 + 리뷰 개수 (실제 데이터가 있을 때만 표시) */}
          {restaurant.score !== null && restaurant.reviewCount > 0 ? (
            <div className="flex items-center gap-1">
              <span style={{ color: '#C9D267' }}>★★★★★</span>
              <span className="text-gray-600 text-sm">({restaurant.reviewCount})</span>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">아직 리뷰가 없습니다</div>
          )}

          {/* 아이콘 영역 + 자세히 버튼 */}
          <div className="flex justify-between items-center mt-3">
            {/* 아이콘 이미지들 */}
            <div className="flex gap-1">
              {displayTags.slice(0, 4).map((tag) => (
                ICON_MAP[tag] && (
                  <img
                    key={tag}
                    src={ICON_MAP[tag]}
                    alt={tag}
                    className="w-6 h-6 object-contain"
                  />
                )
              ))}
            </div>
            <button
              className="px-4 py-1 text-white text-sm font-medium rounded-full hover:opacity-80 transition-colors"
              style={{ backgroundColor: '#C9D267' }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/detail/${restaurantId}`);
              }}
            >
              자세히
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

