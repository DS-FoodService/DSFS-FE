import React, { useRef } from 'react';
import RestaurantCard from './RestaurantCard.jsx'; // 식당 카드 컴포넌트 import

// --- 임시 데이터 ---
// 이 부분은 나중에 백엔드 API로부터 받아서 수정
const onCampusRestaurants = [  {
    id: 'resto_1',
    name: '오늘의 메뉴',
    rating: 4.5,
    reviewCount: 100,
    icon: '오늘의 메뉴 아이콘 영역',
    imageUrl: 'https://placehold.co/300x300/F0E7D8/333?text=Food+Image',
},
    {
    id: 'resto_2',
    name: '비바쿡',
    rating: 4.2,
    reviewCount: 80,
    icon: '비바쿡 아이콘 영역',
    imageUrl: 'https://placehold.co/300x300/D8F0E7/333?text=Food+Image',
    },
    {
    id: 'resto_3',
    name: '포한끼',
    rating: 4.0,
    reviewCount: 50,
    icon: '포한끼 아이콘 영역',
    imageUrl: 'https://placehold.co/300x300/E7D8F0/333?text=Food+Image',
    },
];

const offCampusRestaurants = [
    {
    id: 'resto_4',
    name: '양국',
    rating: 4.8,
    reviewCount: 100,
    icon: '양국 아이콘 영역',
    imageUrl: 'https://placehold.co/300x300/F0D8D8/333?text=Food+Image',
    },
    {
    id: 'resto_5',
    name: '사리원',
    rating: 4.3,
    reviewCount: 80,
    icon: '사리원 아이콘 영역',
    imageUrl: 'https://placehold.co/300x300/D8D8F0/333?text=Food+Image',
    },
    {
    id: 'resto_6',
    name: '엘수에뇨',
    rating: 4.6,
    reviewCount: 50,
    icon: '엘수에뇨 아이콘 영역',
    imageUrl: 'https://placehold.co/300x300/F0EED8/333?text=Food+Image',
    },
];
// --- 임시 데이터 끝 ---


export default function HomePage({ setPage }) {
  // 스크롤 이동을 위한 ref
    const onCampusRef = useRef(null);
    const offCampusRef = useRef(null);

    const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
    <div className="bg-lime-50/30">

      {/* --- 1. '오늘 뭐 먹지?' 섹션 --- */}
        <div className="container px-4 py-16 mx-auto text-center max-w-7xl">
        <h1 className="mb-6 text-5xl font-bold text-gray-800">오늘 뭐 먹지?</h1>

        <div className="flex justify-center gap-4 mb-16">
            <button
            onClick={() => scrollToRef(onCampusRef)}
            className="px-10 py-3 font-semibold transition-all rounded-full shadow-md bg-lime-200 text-lime-900 hover:bg-lime-300"
            >
            학식당
            </button>
            <button
            onClick={() => scrollToRef(offCampusRef)}
            className="px-10 py-3 font-semibold text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100"
            >
            학교 밖 식당
            </button>
        </div>

        {/* --- 2. 'Find the place!' 섹션 (레이아웃 수정) --- */}
        {/*
            - md:flex-row : 중간 크기 화면 이상에서는 가로로 배치
            - flex-col : 모바일 화면에서는 세로로 배치
            - justify-around : 항목들 사이에 균등한 간격
            mid:flex-row -> flex-row (모바일버전에서는 이상해질수도)
        */}
        <div className="flex flex-row items-center justify-around gap-8 p-8 bg-white shadow-lg md:gap-12 rounded-xl">

          {/* 항목 1: Find the place! */}
            <div className="flex flex-col items-center text-center w-60">
            {/* 아이콘 자리 (임시 텍스트) */}
            <span className="mb-3 text-3xl">📍</span>
            <h3 className="mb-2 text-xl font-bold text-gray-800">Find the place!</h3>
            <p className="text-gray-600">Promise To Deliver Within 30 Mins</p>
            </div>

          {/* 항목 2: Select the icon */}
            <div className="flex flex-col items-center text-center w-60">
            {/* 아이콘 자리 (임시 텍스트) */}
            <span className="mb-3 text-3xl">✅</span>
            <h3 className="mb-2 text-xl font-bold text-gray-800">Select the icon</h3>
            <p className="text-gray-600">Your Food Will Be Delivered 100% Fresh</p>
            </div>

          {/* 항목 3: Share */}
            <div className="flex flex-col items-center text-center w-60">
            {/* 아이콘 자리 (임시 텍스트) */}
            <span className="mb-3 text-3xl">📤</span>
            <h3 className="mb-2 text-xl font-bold text-gray-800">Share</h3>
            <p className="text-gray-600">Your Food Link Is Absolutely Free</p>
            </div>
        </div>
        </div>

      {/* --- 3. '학식당' 섹션 --- */}
        <div ref={onCampusRef} className="py-16 bg-white">
        <div className="container px-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">학식당</h2>
            <button
              onClick={() => setPage('menu')} // 'Menu' 페이지로 이동
                className="px-6 py-2 font-semibold text-yellow-900 transition-all bg-yellow-400 rounded-full hover:bg-yellow-500"
            >
                See All
            </button>
            </div>
            {/* - grid-cols-1 : 모바일에서는 1열
            - md:grid-cols-3 : 중간 크기 화면에서는 3열
            - gap-8 : 카드 사이의 간격
          */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {onCampusRestaurants.map((resto) => (
                <RestaurantCard key={resto.id} restaurant={resto} setPage={setPage} />
            ))}
            </div>
        </div>
        </div>

      {/* --- 4. '학교 밖 식당' 섹션 --- */}
        <div ref={offCampusRef} className="py-16 bg-lime-50/30">
        <div className="container px-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">학교 밖 식당</h2>
            <button
              onClick={() => setPage('menu')} // 'Menu' 페이지로 이동
                className="px-6 py-2 font-semibold text-yellow-900 transition-all bg-yellow-400 rounded-full hover:bg-yellow-500"
            >
                See All
            </button>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {offCampusRestaurants.map((resto) => (
                <RestaurantCard key={resto.id} restaurant={resto} setPage={setPage} />
        ))}
            </div>
        </div>
        </div>

      {/* --- 5. '쿠폰' 섹션 (레이아웃 수정) --- */}
        <div className="py-16 bg-white">
        {/* - max-w-7xl : 최대 너비 설정
            - mx-auto : 가운데 정렬
            - px-4 : 좌우 패딩
        */}
        <div className="container px-4 mx-auto max-w-7xl">
            {/*
            - grid-cols-1 : 모바일에서는 1열
            - lg:grid-cols-2 : 큰 화면에서는 2열
            - bg-orange-100 : 주황색 배경
          */}
            <div className="grid items-center grid-cols-1 gap-8 p-8 bg-orange-100 shadow-lg lg:grid-cols-2 rounded-xl">
            {/* 왼쪽 쿠폰 코드 */}
            <div className="text-center">
              {/* 이미지 플레이스홀더 */}
                <img
                src="https://placehold.co/400x200/FDE8C8/333?text=Coupon+Image"
                alt="Coupon"
                className="mx-auto mb-4 rounded-lg"
                onError={(e) => e.target.src = 'https://placehold.co/400x200/FDE8C8/333?text=Image+Error'}
                />
                <p className="text-lg font-semibold text-orange-700">Indian Special</p>
                <h3 className="mb-2 text-3xl font-bold text-gray-800">COUPON CODE</h3>
                <p className="mb-4 text-xl text-gray-600">60% OFF</p>
                <div className="inline-block px-8 py-3 font-bold text-white bg-orange-400 border-2 border-orange-600 border-dashed rounded-lg">
                FOODDASH80
                </div>
            </div>

            {/* 오른쪽 배너 */}
            <div className="text-center">
              {/* 이미지 플레이스홀더 */}
                <img
                src="https://placehold.co/500x300/FCA5A5/333?text=Restaurant+Banner"
                alt="Restaurant Banner"
                className="object-cover w-full h-auto rounded-lg"
                onError={(e) => e.target.src = 'https://placehold.co/500x300/FCA5A5/333?text=Image+Error'}
                />
            </div>
            </div>
        </div>
        </div>

    </div>
    );
}
