import React, { useState, useEffect } from 'react';
import RestaurantCard from './RestaurantCard.jsx';
import api from "./api/client";
import { images } from "./data/images";

const FILTERS = [
  { id: "gluten_free", name: "Gluten-Free", icon: images.find(i => i.name.includes("gluten"))?.src },
  { id: "halal", name: "Halal", icon: images.find(i => i.name.includes("halal"))?.src },
  { id: "byo", name: "BYO", icon: images.find(i => i.name.includes("byo"))?.src },
  { id: "vegan", name: "Vegan", icon: images.find(i => i.name.includes("vegan"))?.src },
  { id: "local", name: "Local", icon: images.find(i => i.name.includes("local"))?.src },
];

export const MenuPage = ({ setPage }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  // 페이지 로드 시 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 학식당 API 호출
  useEffect(() => {
    const fetchOnCampusRestaurants = async () => {
      try {
        const { data } = await api.get("/restaurants", {
          params: { query: "ON_CAMPUS", page: 0, size: 20 }
        });
        console.log("🏫 학식당 목록:", data);
        setRestaurants(data.result?.restaurants || []);
      } catch (error) {
        console.error("❌ 학식당 목록 불러오기 실패:", error);
      }
    };
    fetchOnCampusRestaurants();
  }, []);

  const handleFilterToggle = (filterId) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredRestaurants = restaurants.filter((resto) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = resto.name.toLowerCase().includes(searchTermLower);

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.every((filterId) => resto.tags?.includes(filterId));

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 필터 아이콘 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterToggle(f.id)}
              className={`p-1 transition-all ${activeFilters.includes(f.id) ? "scale-110" : "opacity-70 hover:opacity-100"}`}
            >
              <img src={f.icon} alt={f.name} className="w-15 h-9 object-contain" />
            </button>
          ))}
        </div>

        {/* 식당 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((resto) => (
              <RestaurantCard key={resto.restaurantId} restaurant={resto} setPage={setPage} />
            ))
          ) : (
            <p className="text-gray-600 md:col-span-3 text-center text-lg">검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
