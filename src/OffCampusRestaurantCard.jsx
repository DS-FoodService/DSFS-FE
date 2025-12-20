import { useAuth } from "./AuthContext.jsx";

const OffCampusRestaurantCard = ({ restaurant, setPage, onSelect, isSelected }) => {
  const { id, name, rating, reviewCount, tags, menus } = restaurant;
  const { favorites, toggleFavorite } = useAuth();
  const isFavorite = favorites.some(f => f.restaurantId === id);

  const handleCardClick = () => {
    onSelect(restaurant);
  };

  const handleReviewClick = (e) => {
    e.stopPropagation();
    alert(`${name} 리뷰 보기 (구현 필요)`);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    alert(`${name} 상세 메뉴 보기 (구현 필요)`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(id, isFavorite);
  };

  const tagIcons = {
    gluten_free: '🌾',
    halal: '🕌',
    byo: '🍼',
    vegan: '🌿',
    local: '📍',
  };

  return (
    <div
      onClick={handleCardClick}
      className={`p-4 rounded-lg cursor-pointer transition-all
        ${isSelected ? 'bg-lime-200 shadow-xl scale-105' : 'bg-lime-50/60 hover:shadow-lg'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{name}</h3>
          <button onClick={handleReviewClick} className="mt-1" aria-label={`${name} 리뷰 보기`}>
            <div className="flex items-center gap-1">
              <span>⭐ {rating ?? 0}</span>
              <span className="text-gray-600">({reviewCount ?? 0})</span>
            </div>
          </button>
        </div>

        {/* Favorite Button with Heart Images */}
        <button
          onClick={handleFavoriteClick}
          className="p-1 hover:scale-110 transition-transform"
          aria-label={isFavorite ? "찜 해제" : "찜하기"}
        >
          <img
            src={isFavorite ? "/assets/restaurants/heart-filled.png" : "/assets/restaurants/heart-empty.png"}
            alt={isFavorite ? "찜 해제" : "찜하기"}
            className="w-6 h-6"
          />
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {tags.slice(0, 3).map(tagId => (
            <span key={tagId} className="text-xl" title={tagId}>{tagIcons[tagId] || '❔'}</span>
          ))}
        </div>
        <button
          onClick={handleDetailsClick}
          className="px-4 py-1.5 bg-lime-100 text-lime-800 text-sm font-semibold rounded-full hover:bg-lime-200 transition-colors"
        >
          자세히
        </button>
      </div>
      <div onClick={handleDetailsClick} className="border-2 border-dashed border-lime-300 rounded-lg p-3 min-h-[80px] text-sm text-gray-600 hover:bg-lime-100">
        <p className="font-semibold mb-1">대표 메뉴:</p>
        <ul className="list-disc list-inside pl-1">
          {menus.slice(0, 2).map(menu => (
            <li key={menu.name}>{menu.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OffCampusRestaurantCard;