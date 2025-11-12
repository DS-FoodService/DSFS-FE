import { useAuth } from "./AuthContext.jsx";

const RestaurantCard = ({ restaurant }) => {
  const { favorites, toggleFavorite } = useAuth();
  const isFavorite = favorites.includes(restaurant.id);

  return (
    <div className="relative shadow-lg p-4 rounded-xl bg-white">
      <button
        className="absolute top-2 right-2"
        onClick={() => toggleFavorite(restaurant.id)}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <img src={restaurant.imageUrl} alt={restaurant.name} />
      <h2>{restaurant.name}</h2>
    </div>
  );
};

export default RestaurantCard;