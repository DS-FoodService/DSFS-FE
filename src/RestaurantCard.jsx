import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

// (별점 컴포넌트)
const StarRating = ({ rating, reviewCount }) => { // [수정] 사용자 코드: props 이름 reviewCount로 통일
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    // [수정] 사용자 코드: items-center, justify-center 추가
    <div className="flex items-center justify-center md:justify-start"> 
      {/* [수정] 사용자 코드: svg 크기 w-5 h-5로 변경 */}
      <div className="flex text-yellow-400"> 
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.09l6.572-.955L10 0l2.939 6.135 6.572.955-4.756 4.455 1.123 6.545z" /></svg>
        ))}
        {halfStar && (
          // [수정] 사용자 코드: 반 별 아이콘 path 수정
          <svg key="half" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.09l6.572-.955L10 0v15z" /></svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.09l6.572-.955L10 0l2.939 6.135 6.572.955-4.756 4.455 1.123 6.545z" /></svg>
        ))}
      </div>
      {/* [수정] 사용자 코드: props 이름 reviewCount로 통일, ml-2 추가 */}
      <span className="text-gray-600 text-sm ml-2">({reviewCount})</span> 
    </div>
  );
};

// ('좋아요' 버튼 컴포넌트)
const FavoriteButton = ({ restaurantId }) => {
  const { isLoggedIn, favorites, toggleFavorite, showLoginModal } = useAuth();
  
  // [수정] 사용자 코드: isFavorite 상태를 useEffect 없이 직접 계산
  const isFavorite = favorites.includes(restaurantId); 

  const handleClick = (e) => { // [수정] 사용자 코드: 함수명 handleClick으로 통일
    e.stopPropagation(); 
    e.preventDefault(); 
    if (!isLoggedIn) {
      alert("로그인이 필요합니다!"); // TODO: 모달로 변경
      showLoginModal();
      return;
    }
    toggleFavorite(restaurantId, isFavorite);
  };

  // [수정] 사용자 코드: 원본 디자인에 맞게 스타일 변경 (위치, 색상, 아이콘)
  return (
    <button
      onClick={handleClick}
      // [수정] 위치를 카드 왼쪽 상단으로 (top-4 left-4)
      className={`absolute top-4 left-4 z-10 p-2 rounded-full ${ 
        isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/70 text-gray-600 hover:text-red-500'
      } transition-all backdrop-blur-sm shadow-md`}
      aria-label="Toggle favorite" // [수정] 사용자 코드: aria-label 수정
    >
      {/* [수정] 사용자 코드: 아이콘 path 수정, fill 속성 조건부 적용 */}
      <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" />
      </svg>
    </button>
  );
};

// (식당 카드 메인 컴포넌트)
const RestaurantCard = ({ restaurant, setPage }) => {
  // [수정] 사용자 코드: props 이름 원본 디자인 기준으로 통일 (imageUrl, reviewCount, icon)
  const { id, name, rating, reviewCount, icon, imageUrl } = restaurant; 

  const handleCardClick = () => {
    alert(`${name} 상세 페이지로 이동합니다. (구현 필요)`);
    // setPage(`detail/${id}`); 
  };

  const handleReviewClick = (e) => { // [수정] 사용자 코드: 함수 추가
     e.stopPropagation();
     alert(`${name} 리뷰 보기 (구현 필요)`);
     // setPage(`reviews/${id}`);
  };

  const handleDetailsClick = (e) => { // [수정] 사용자 코드: 함수 분리
      e.stopPropagation();
      alert(`${name} 자세히 보기 (구현 필요)`);
      // setPage(`detail/${id}`);
  };

  // [수정] 사용자 코드: 원본 디자인(점선 원형) 구조 및 스타일 적용
  return (
    <div 
      onClick={handleCardClick} 
      // [수정] overflow-visible, p-4, items-center 추가
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-visible p-4 relative flex flex-col items-center" 
    >
      {/* [수정] 사용자 코드: FavoriteButton 컴포넌트 사용 */}
      <FavoriteButton restaurantId={id} /> 

      {/* 점선 원형 테두리 (새로 추가된 구조) */}
      <div className="relative w-48 h-48 mb-4">
        <div className="absolute inset-0 border-2 border-dashed border-lime-400 rounded-full animate-spin-slow"></div>
        <div className="relative w-full h-full p-2"> 
          <img 
            src={imageUrl} // [수정] 사용자 코드: image -> imageUrl
            alt={name}
            className="w-full h-full object-cover rounded-full shadow-lg"
            // [수정] 사용자 코드: onError 이미지 URL 변경
            onError={(e) => e.target.src = 'https://placehold.co/184x184/F0E7D8/333?text=Error'} 
          />
        </div>
      </div>

      {/* 카드 내용 */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        {/* [수정] 사용자 코드: 별점 부분을 버튼으로 감싸서 클릭 가능하게 */}
        <button onClick={handleReviewClick} className="mb-3" aria-label={`${name} 리뷰 보기`}>
            {/* [수정] 사용자 코드: props 이름 count -> reviewCount */}
            <StarRating rating={rating} reviewCount={reviewCount} /> 
        </button>
        
        {/* [수정] 사용자 코드: 아이콘 부분 스타일 및 구조 변경 (원본 디자인) */}
        <div className="flex justify-between items-center mt-4 w-full px-4">
          <div className="flex items-center gap-2 text-gray-600">
            {/* TODO: 아이콘을 <img> 또는 SVG로 교체 */}
            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">?</span>
            {/* [수정] 사용자 코드: iconPlaceholder 대신 icon 사용 */}
            <span>{icon}</span> 
          </div>
          <button 
            onClick={handleDetailsClick} // [수정] 사용자 코드: 함수 분리
            // [수정] 사용자 코드: 버튼 스타일 변경
            className="px-4 py-1.5 bg-lime-100 text-lime-800 text-sm font-semibold rounded-full hover:bg-lime-200 transition-colors" 
          >
            자세히
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;