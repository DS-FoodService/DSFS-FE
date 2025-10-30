import React, { useRef } from 'react';
import RestaurantCard from './RestaurantCard.jsx'; // 식당 카드 컴포넌트 import

export const HomePage = ({ setPage }) => {
  const onCampusRef = useRef(null); // [수정] 사용자 코드: 변수명 변경
  const offCampusRef = useRef(null); // [수정] 사용자 코드: 변수명 변경

  const scrollToRef = (ref) => { // [수정] 사용자 코드: 함수명 변경
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- 임시 데이터 ---
  // [수정] 사용자 코드: props 이름 원본 디자인 기준으로 통일 (imageUrl, reviewCount, icon)
  const onCampusRestaurants = [
    { id: 'resto_1', name: '오늘의 메뉴', rating: 4.5, reviewCount: 100, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/F0E7D8/333?text=Food+1' },
    { id: 'resto_2', name: '비바쿡', rating: 4.2, reviewCount: 80, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/D8F0E7/333?text=Food+2' },
    { id: 'resto_3', name: '포한끼', rating: 4.0, reviewCount: 50, icon: '어양O L', imageUrl: 'https://placehold.co/184x184/E7D8F0/333?text=Food+3' },
  ];
  const offCampusRestaurants = [
    { id: 'resto_4', name: '양국', rating: 4.8, reviewCount: 100, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/F0D8D8/333?text=Food+4' },
    { id: 'resto_5', name: '사리원', rating: 4.3, reviewCount: 80, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/D8D8F0/333?text=Food+5' },
    { id: 'resto_6', name: '엘수에뇨', rating: 4.6, reviewCount: 50, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/F0EED8/333?text=Food+6' },
    // [삭제] 사용자 코드에 있던 추가 식당 데이터 제외 (필요시 추가)
  ];
  // --- 임시 데이터 끝 ---

  return (
    // [수정] 사용자 코드: 배경색 변경
    <div className="bg-lime-50/30"> 

      {/* --- 1. '오늘 뭐 먹지?' 섹션 (좌/우 정렬 버전) --- */}
<div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

    {/* 왼쪽: 제목 + 버튼 (세로 정렬, 왼쪽 정렬) */}
    <div className="flex flex-col justify-center items-start text-left space-y-6">
      <h1 className="text-5xl lg:text-6xl font-bold text-gray-800">오늘 뭐 먹지?</h1>
      
      {/* 버튼 2개를 가로로 배치 */}
      <div className="flex gap-4">
        <button
          onClick={() => scrollToRef(onCampusRef)}
          className="px-10 py-3 bg-lime-200 text-lime-900 font-semibold rounded-full shadow-md hover:bg-lime-300 transition-all text-lg"
        >
          학식당
        </button>
        <button
          onClick={() => scrollToRef(offCampusRef)}
          className="px-10 py-3 bg-white text-gray-700 font-semibold rounded-full border border-gray-300 shadow-sm hover:bg-gray-100 transition-all text-lg"
        >
          학교 밖 식당
        </button>
      </div>
    </div>

    {/* 오른쪽: 원형 음식 이미지 */}
    <div className="flex justify-center md:justify-end">
      <img 
        src="https://placehold.co/400x400/F0E7D8/333?text=Main+Food+Image" 
        alt="메인 음식"
        className="rounded-full w-80 h-80 lg:w-96 lg:h-96 object-cover shadow-xl"
        onError={(e) => e.target.src = 'https://placehold.co/400x400/F0E7D8/333?text=Error'}
      />
    </div>

  </div>
</div>

{/* --- 2. 'Find the place!' 섹션 --- */}
<div className="py-20 bg-white">
  <div className="container mx-auto max-w-6xl px-6">
    {/* 가로 3등분 */}
    <div className="grid grid-cols-3 gap-12">

      {/* 항목 1 */}
      <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
        <span className="text-5xl sm:text-6xl">📍</span>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Find the place!</h3>
          <p className="text-gray-600 text-sm">Promise To Deliver Within 30 Mins</p>
        </div>
      </div>

      {/* 항목 2 */}
      <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
        <span className="text-5xl sm:text-6xl">✅</span>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Select the icon</h3>
          <p className="text-gray-600 text-sm">Your Food Will Be Delivered 100% Fresh</p>
        </div>
      </div>

      {/* 항목 3 */}
      <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
        <span className="text-5xl sm:text-6xl">📤</span>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Share</h3>
          <p className="text-gray-600 text-sm">Your Food Link Is Absolutely Free</p>
        </div>
      </div>

    </div>
  </div>
</div>

<div className="bg-lime-300 text-lime-900 p-4 rounded-lg">
  색상 테스트 박스
</div>

      {/* --- 3. '학식당' 섹션 --- */}
<div ref={onCampusRef} className="py-16 bg-lime-50/30"> 
  <div className="container mx-auto max-w-7xl px-4">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800">학식당</h2>
      <button
  onClick={() => setPage('menu')}
  className="px-6 py-2 bg-gradient-to-r from-lime-200 to-lime-400 text-lime-900 font-semibold rounded-full shadow-md 
             hover:from-lime-300 hover:to-lime-500 hover:-translate-y-0.5 hover:shadow-lg 
             transition-all duration-300 ease-in-out"
>
  See All
</button>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {onCampusRestaurants.map((resto) => (
        <RestaurantCard key={resto.id} restaurant={resto} setPage={setPage} /> 
      ))}
    </div>
  </div>
</div>

{/* --- 4. '학교 밖 식당' 섹션 --- */}
<div ref={offCampusRef} className="py-16 bg-white"> 
  <div className="container mx-auto max-w-7xl px-4">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800">학교 밖 식당</h2>
      <button
        onClick={() => setPage('menu')}
        className="px-6 py-2 bg-gradient-to-r from-lime-200 to-lime-400 text-lime-900 font-semibold rounded-full shadow-md 
                   hover:from-lime-300 hover:to-lime-500 hover:-translate-y-0.5 hover:shadow-lg 
                   transition-all duration-300 ease-in-out"
      >
        See All
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {offCampusRestaurants.map((resto) => (
        <RestaurantCard key={resto.id} restaurant={resto} setPage={setPage} />
      ))}
    </div>
  </div>
</div>


      {/* --- 5. '쿠폰' 섹션 --- */}
      {/* [수정] 사용자 코드: 전체 구조를 원본 디자인(2열, 이미지 포함)으로 변경 */}
      <div className="py-16 bg-lime-50/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            {/* 왼쪽 쿠폰 코드 */}
            <div className="text-center">
              <img
                src="https://placehold.co/400x200/FDE8C8/333?text=Coupon+Image"
                alt="Coupon"
                className="mx-auto mb-4 rounded-lg"
                onError={(e) => e.target.src = 'https://placehold.co/400x200/FDE8C8/333?text=Image+Error'}
              />
              <p className="text-lg font-semibold text-orange-700">Indian Special</p>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">COUPON CODE</h3>
              <p className="text-xl text-gray-600 mb-4">60% OFF</p>
              <div className="inline-block px-8 py-3 bg-orange-400 text-white font-bold rounded-lg border-2 border-dashed border-orange-600">
                FOODDASH80
              </div>
            </div>
            {/* 오른쪽 배너 */}
            <div className="text-center">
              <img
                src="https://placehold.co/500x300/FCA5A5/333?text=Restaurant+Banner"
                alt="Restaurant Banner"
                className="w-full h-auto rounded-lg object-cover"
                onError={(e) => e.target.src = 'https://placehold.co/500x300/FCA5A5/333?text=Image+Error'}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HomePage;