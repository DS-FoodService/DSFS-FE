import { useEffect, useState } from "react";
import api from "./api/client";
import RestaurantCard from "./RestaurantCard";

export default function MenuPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ 학식당 데이터 불러오기
  const fetchRestaurants = async (searchValue = "") => {
    try {
      const params = {
        query: "ON_CAMPUS",
        page: 0,
        size: 30,
      };
      if (searchValue) params.keyword = searchValue; // ✅ 검색어 추가

      const { data } = await api.get("/restaurants", { params });
      setRestaurants(data.result?.restaurants || []);
    } catch (err) {
      console.error("❌ 학식당 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 페이지 최초 로드 시 전체 목록 불러오기
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // ✅ 검색 실행
  const handleSearch = () => {
    setLoading(true);
    setSearchTerm(keyword);
    fetchRestaurants(keyword);
  };

  // ✅ 엔터 키로도 검색 실행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        로딩 중...
      </div>
    );

  return (
    <div className="bg-lime-50 min-h-screen py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">학식당 전체</h1>

        {/* ✅ 검색창 */}
        <div className="flex mb-8">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="식당 이름 또는 키워드를 입력하세요"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-lime-300 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-lime-400 text-white font-semibold rounded-r-lg hover:bg-lime-500 transition-colors"
          >
            검색
          </button>
        </div>

        {/* ✅ 검색결과 표시 */}
        {searchTerm && (
          <p className="text-gray-500 mb-6">
            “{searchTerm}” 검색 결과 ({restaurants.length}개)
          </p>
        )}

        {/* ✅ 결과 렌더링 */}
        {restaurants.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">
            해당 조건에 맞는 식당이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.restaurantId}
                restaurant={restaurant}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
