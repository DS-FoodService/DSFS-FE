import React, { useRef } from 'react';
import RestaurantCard from './RestaurantCard.jsx';
import { images } from "./data/images";

export const HomePage = ({ setPage }) => {
  const onCampusRef = useRef(null);
  const offCampusRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // mainfood 이미지 가져오기
  const mainFoodImage = images.find(i => i.name === "mainfood")?.src;

  // 임시 데이터
  const onCampusRestaurants = [
    { id: 'resto_1', name: '오늘의 메뉴', rating: 4.5, reviewCount: 100, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/F0E7D8/333?text=Food+1' },
    { id: 'resto_2', name: '비바쿡', rating: 4.2, reviewCount: 80, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/D8F0E7/333?text=Food+2' },
    { id: 'resto_3', name: '포한끼', rating: 4.0, reviewCount: 50, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/E7D8F0/333?text=Food+3' },
  ];

  const offCampusRestaurants = [
    { id: 'resto_4', name: '양국', rating: 4.8, reviewCount: 100, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/F0D8D8/333?text=Food+4' },
    { id: 'resto_5', name: '사리원', rating: 4.3, reviewCount: 80, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/D8D8F0/333?text=Food+5' },
    { id: 'resto_6', name: '엘수에뇨', rating: 4.6, reviewCount: 50, icon: '아이콘', imageUrl: 'https://placehold.co/184x184/F0EED8/333?text=Food+6' },
  ];

  return (
    <div className="bg-lime-50/30">

      {/* --- 1. 오늘 뭐 먹지? --- */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

          {/* 왼쪽 텍스트 */}
          <div className="flex flex-col justify-center items-start text-left space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800">오늘 뭐 먹지?</h1>

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

          {/* ✅ 오른쪽: mainfood.png 사용 */}
          <div className="flex justify-center md:justify-end">
            <img
              src={mainFoodImage}
              alt="메인 음식"
              className="rounded-full w-80 h-80 lg:w-96 lg:h-96 object-cover shadow-xl"
            />
          </div>
        </div>
      </div>


      {/* --- 2. Find the place! --- */}
      <div className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-center">

            <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
              <span className="text-5xl sm:text-6xl">📍</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Find the place!</h3>
                <p className="text-gray-600 text-sm">Promise To Deliver Within 30 Mins</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
              <span className="text-5xl sm:text-6xl">✅</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Select the icon</h3>
                <p className="text-gray-600 text-sm">Your Food Will Be Delivered 100% Fresh</p>
              </div>
            </div>

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


      {/* --- 3. 학식당 --- */}
      <div ref={onCampusRef} className="py-16 bg-lime-50/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">학식당</h2>
            <button
              onClick={() => setPage('menu')}
              className="px-6 py-2 bg-gradient-to-r from-lime-200 to-lime-400 text-lime-900 font-semibold rounded-full shadow-md hover:from-lime-300 hover:to-lime-500 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out"
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

      {/* --- 4. 학교 밖 식당 --- */}
      <div ref={offCampusRef} className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">학교 밖 식당</h2>

            <button
              onClick={() => setPage('offcampus')}
              className="px-6 py-2 bg-gradient-to-r from-lime-200 to-lime-400 text-lime-900 font-semibold rounded-full shadow-md hover:from-lime-300 hover:to-lime-500 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out"
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

    </div>
  );
};

export default HomePage;
