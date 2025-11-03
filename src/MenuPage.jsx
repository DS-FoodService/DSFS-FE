import React, { useState } from 'react';
import RestaurantCard from './RestaurantCard.jsx';


const FILTERS = [
  { id: 'gluten_free', name: 'Gluten-Free', icon: '🌾' }, // 아이콘은 임시 텍스트
  { id: 'halal', name: 'Halal', icon: '🕌' },
  { id: 'byo', name: 'BYO', icon: '🍼' },
  { id: 'vegan', name: 'Vegan', icon: '🌿' },
  { id: 'local', name: 'Local', icon: '📍' },
];

// MenuPage에서 사용할 학식당 데이터 (임시)
const allOnCampusRestaurants = [
  { 
    id: 'resto_1', 
    name: '오늘의 메뉴', 
    rating: 4.5, 
    reviewCount: 100, 
    icon: '한식', // RestaurantCard에서 표시될 아이콘
    imageUrl: 'https://placehold.co/184x184/F0E7D8/333?text=Food+1',
    tags: ['local', 'vegan'], // 필터링을 위한 태그
    menus: [ // 메뉴 검색을 위한 데이터
      { name: '비빔밥', tags: ['vegan', 'local'] },
      { name: '제육덮밥', tags: ['local'] }
    ]
  },
  { 
    id: 'resto_2', 
    name: '비바쿡', 
    rating: 4.2, 
    reviewCount: 80, 
    icon: '양식', 
    imageUrl: 'https://placehold.co/184x184/D8F0E7/333?text=Food+2',
    tags: ['gluten_free'],
    menus: [
      { name: '알리오 올리오', tags: ['gluten_free'] },
      { name: '까르보나라', tags: [] }
    ]
  },
  { 
    id: 'resto_3', 
    name: '포한끼', 
    rating: 4.0, 
    reviewCount: 50, 
    icon: '쌀국수', 
    imageUrl: 'https://placehold.co/184x184/E7D8F0/333?text=Food+3',
    tags: ['local'],
    menus: [
      { name: '소고기 쌀국수', tags: ['local'] },
      { name: '분짜', tags: [] }
    ]
  },
  { 
    id: 'resto_10', // 새 ID
    name: '미구엘의 돈까스가게', 
    rating: 4.6, 
    reviewCount: 120, 
    icon: '일식', 
    imageUrl: 'https://placehold.co/184x184/F0F0D8/333?text=Food+4',
    tags: ['byo'],
    menus: [
      { name: '등심 돈까스', tags: ['byo'] },
      { name: '치즈 돈까스', tags: ['byo'] }
    ]
  },
  { 
    id: 'resto_11', // 새 ID
    name: '한우사골 마라탕', 
    rating: 4.3, 
    reviewCount: 50, 
    icon: '중식', 
    imageUrl: 'https://placehold.co/184x184/F0D8E8/333?text=Food+5',
    tags: ['halal', 'local'], // 할랄, 로컬 태그 추가 (임시)
    menus: [
      { name: '마라탕', tags: ['halal', 'local'] },
      { name: '마라샹궈', tags: ['halal', 'local'] }
    ]
  },
];


export const MenuPage = ({ setPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]); // 선택된 필터 (id 배열)

  // 필터 아이콘 클릭 핸들러
  const handleFilterToggle = (filterId) => {
    setActiveFilters((prevFilters) => {
      if (prevFilters.includes(filterId)) {
        // 이미 있으면 제거
        return prevFilters.filter((id) => id !== filterId);
      } else {
        // 없으면 추가
        return [...prevFilters, filterId];
      }
    });
  };

  // 검색어와 필터에 따라 식당 목록 필터링
  const filteredRestaurants = allOnCampusRestaurants.filter((resto) => {
    const searchTermLower = searchTerm.toLowerCase();

    // 1. 검색어 필터 (식당 이름 또는 메뉴 이름)
    const matchesSearch = 
      resto.name.toLowerCase().includes(searchTermLower) ||
      resto.menus.some((menu) => menu.name.toLowerCase().includes(searchTermLower));

    // 2. 활성 아이콘 필터 (선택된 모든 아이콘을 포함해야 함)
    const matchesFilters = 
      activeFilters.length === 0 || // 선택된 필터가 없으면 모두 통과
      activeFilters.every((filterId) => resto.tags.includes(filterId));

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">학식당</h1>

        {/* 검색창 */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="식당 또는 메뉴 검색..."
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* 필터 아이콘 버튼 */}
        <div className="flex flex-wrap gap-3 mb-4">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterToggle(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 border-2 rounded-full transition-all text-sm font-semibold
                ${activeFilters.includes(filter.id)
                  ? 'bg-lime-200 border-lime-300 text-lime-900 shadow-md' // 활성 상태
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100' // 비활성 상태
                }
              `}
            >
              <span className="text-lg">{filter.icon}</span>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>
        
        {/* TODO: 이미지에 있는 두 번째 아이콘 줄 (필요시 추가) */}
        {/* <div className="flex flex-wrap gap-3 mb-8"> ... </div> */}

        {/* 식당 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((resto) => (
              <RestaurantCard key={resto.id} restaurant={resto} setPage={setPage} />
            ))
          ) : (
            <p className="text-gray-600 md:col-span-3 text-center text-lg">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;