import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const StarRating = ({ rating = 0, count = 0 }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center space-x-1 text-yellow-400">
            {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
            ))}
            {halfStar && (
                <svg key="half" className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} className="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
            ))}
            <span className="text-sm text-gray-500 ml-1">({count})</span>
        </div>
    );
};

const FavoriteButton = ({ restaurantId }) => {
    const { isLoggedIn, favorites, toggleFavorite, showLoginModal } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (favorites) {
            setIsFavorite(favorites.includes(restaurantId));
        }
    }, [favorites, restaurantId]);

    const handleToggle = async () => {
        if (!isLoggedIn) {
            console.warn("로그인이 필요합니다.");
            showLoginModal();
            return;
        }
        try {
            await toggleFavorite(restaurantId, isFavorite);
        } catch (error) {
            console.error("Error toggling favorite: ", error);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`absolute top-4 left-4 p-2 rounded-full transition-colors ${
                isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
            }`}
            aria-label="좋아요"
        >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
        </button>
    );
};

const RestaurantCard = ({ restaurant, setPage }) => {
    const { name, rating, count, image, price, iconPlaceholder } = restaurant;

    const handleDetailsClick = () => {
        console.log(`'자세히' 클릭: ${name} (상세 페이지 이동 구현 필요)`);
        // setPage('details', { restaurantId: restaurant.id });
    };
    
    const handleReviewClick = () => {
         console.log(`'별점' 클릭: ${name} (리뷰 보기 구현 필요)`);
         // setPage('reviews', { restaurantId: restaurant.id });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative transition-transform hover:scale-105">
            <FavoriteButton restaurantId={restaurant.id} />
            <div className="p-4 pt-12">
                <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <img 
                        src={image} 
                        alt={name} 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://placehold.co/300x300/F3F4F6/9CA3AF?text=Image+Error'; }}
                    />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
                <button onClick={handleReviewClick} className="mb-3" aria-label={`${name} 리뷰 보기`}>
                    <StarRating rating={rating} count={count} />
                </button>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs">?</span>
                        </div>
                        <span>{iconPlaceholder || (price ? `~${price}원` : "아이콘")}</span>
                    </div>
                    <button
                        onClick={handleDetailsClick}
                        className="bg-lime-100 text-lime-800 font-semibold px-4 py-2 rounded-full text-sm hover:bg-lime-200 transition-colors"
                    >
                        자세히
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;