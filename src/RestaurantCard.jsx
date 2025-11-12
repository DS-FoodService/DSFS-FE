import { useAuth } from "./AuthContext.jsx";

const RestaurantCard = ({ restaurant }) => {
  const { favorites, toggleFavorite } = useAuth();

  const isFavorite = favorites.includes(restaurant.id);

  return (
    <button
      className="absolute right-4 top-4"
      onClick={() => toggleFavorite(restaurant.id, isFavorite)}
    >
      <img
        src={isFavorite ? "/heart-filled.png" : "/heart-empty.png"}
        className="w-6 h-6"
      />
    </button>
  );
};
