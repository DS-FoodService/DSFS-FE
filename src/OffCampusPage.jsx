import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/client";
import { images } from "./data/images";

const KAKAO_APP_KEY = "8668be1b8e7bcc2a3ba8e26af8f107c6";

// ✅ Kakao 지도 컴포넌트
const KakaoMap = ({ restaurants, selectedRestaurant }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const navigate = useNavigate();

  // 지도 초기화
  useEffect(() => {
    const initMap = () => {
      if (!window.kakao?.maps || !mapRef.current) return;
      const kakaoMap = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.6514, 127.016),
        level: 4,
      });
      setMap(kakaoMap);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const myPos = new window.kakao.maps.LatLng(
              pos.coords.latitude,
              pos.coords.longitude
            );
            setUserPos(myPos);
            new window.kakao.maps.Marker({ position: myPos, map: kakaoMap });
            kakaoMap.setCenter(myPos);
          },
          () => console.warn("위치 접근 실패 — 기본 중심 유지")
        );
      }
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
      script.async = true;
      script.onload = () => window.kakao.maps.load(initMap);
      document.head.appendChild(script);
    }
  }, []);

  // 마커 추가
  useEffect(() => {
    if (!map || !restaurants?.length) return;

    const markers = restaurants.map((resto) => {
      const lat = resto.latitude || resto.lat;
      const lng = resto.longitude || resto.lng;
      if (!lat || !lng) return null;
      const pos = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({ position: pos, map });
      window.kakao.maps.event.addListener(marker, "click", () => {
        navigate(`/detail/${resto.restaurantId}`);
      });
      return marker;
    }).filter(Boolean);

    return () => markers.forEach((m) => m.setMap(null));
  }, [map, restaurants]);

  // 선택 시 지도 이동
  useEffect(() => {
    if (!map) return;
    if (selectedRestaurant) {
      const moveTo = new window.kakao.maps.LatLng(
        selectedRestaurant.latitude,
        selectedRestaurant.longitude
      );
      map.panTo(moveTo);
    } else if (userPos) {
      map.setCenter(userPos);
    }
  }, [selectedRestaurant, userPos, map]);

  return <div ref={mapRef} className="w-full h-full" />;
};

// ✅ OffCampusPage
export default function OffCampusPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 필터 목록
  const FILTERS = [
    { id: "HALAL", name: "Halal", icon: images.find(i => i.name.includes("halal"))?.src },
    { id: "VEGAN", name: "Vegan", icon: images.find(i => i.name.includes("vegan"))?.src },
    { id: "GF", name: "Gluten-Free", icon: images.find(i => i.name.includes("gluten"))?.src },
    { id: "LOCAL", name: "Local", icon: images.find(i => i.name.includes("local"))?.src },
  ];

  const handleFilterToggle = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // ✅ 식당 데이터 불러오기 (검색 + 필터 반영)
  const fetchRestaurants = async (searchValue = "") => {
    try {
      const params = {
        query: "OFF_CAMPUS",
        page: 0,
        size: 30,
      };
      if (searchValue) params.keyword = searchValue;
      if (activeFilters.length > 0) params.icons = activeFilters;

      const { data } = await api.get("/restaurants", { params });
      setRestaurants(data.result?.restaurants || []);
    } catch (err) {
      console.error("❌ 학교 밖 식당 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 페이지 로드 및 필터 변경 시 자동 호출
  useEffect(() => {
    fetchRestaurants(searchTerm);
  }, [activeFilters]);

  // ✅ 검색 실행
  const handleSearch = () => {
    setSearchTerm(keyword);
    setLoading(true);
    fetchRestaurants(keyword);
  };

  // ✅ 엔터 키로 검색
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const filteredRestaurants = restaurants.filter(
    (r) => activeFilters.length === 0 || activeFilters.every((f) => r.icons?.includes(f))
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        로딩 중...
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* 왼쪽 패널 */}
      <div className="w-full md:w-1/3 p-6 bg-white overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">학교 밖 식당</h1>

        {/* ✅ 검색창 */}
        <div className="flex mb-6">
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

        {/* ✅ 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterToggle(f.id)}
              className={`p-1 transition-all ${
                activeFilters.includes(f.id)
                  ? "scale-110 border border-lime-400 rounded-md"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <img src={f.icon} alt={f.name} className="w-16 h-16 object-contain" />
            </button>
          ))}
        </div>

        {/* ✅ 결과 목록 */}
        {searchTerm && (
          <p className="text-gray-500 mb-4">
            “{searchTerm}” 검색 결과 ({restaurants.length}개)
          </p>
        )}

        <ul className="space-y-3">
          {filteredRestaurants.length === 0 ? (
            <li className="text-gray-500 text-center mt-10">
              조건에 맞는 식당이 없습니다.
            </li>
          ) : (
            filteredRestaurants.map((resto) => (
              <li
                key={resto.restaurantId}
                onClick={() => setSelectedRestaurant(resto)}
                className={`cursor-pointer border p-3 rounded-md ${
                  selectedRestaurant?.restaurantId === resto.restaurantId
                    ? "bg-lime-100 border-lime-500"
                    : "border-gray-200"
                }`}
              >
                {resto.name}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* 지도 */}
      <div className="w-full md:w-2/3 h-full">
        <KakaoMap restaurants={filteredRestaurants} selectedRestaurant={selectedRestaurant} />
      </div>
    </div>
  );
}
