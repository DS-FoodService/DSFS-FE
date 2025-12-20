import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/client";
import { images } from "./data/images";
import { useAuth } from "./AuthContext.jsx";

const KAKAO_APP_KEY = "8668be1b8e7bcc2a3ba8e26af8f107c6";

const KakaoMap = ({ restaurants, selectedRestaurant }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const navigate = useNavigate();

  // ✅ 지도 초기화
  useEffect(() => {
    const initMap = () => {
      if (!window.kakao?.maps || !mapRef.current) return;
      const kakaoMap = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.6514, 127.016),
        level: 4,
      });
      setMap(kakaoMap);

      // ✅ 내 위치
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

  // ✅ 식당 마커
  useEffect(() => {
    if (!map || !restaurants?.length) return;

    const markers = restaurants.map((resto) => {
      if (!resto.lat || !resto.lng) return null;
      const pos = new window.kakao.maps.LatLng(resto.lat, resto.lng);
      const marker = new window.kakao.maps.Marker({ position: pos, map });
      window.kakao.maps.event.addListener(marker, "click", () => {
        navigate(`/detail/${resto.restaurantId}`);
      });
      return marker;
    }).filter(Boolean);

    return () => markers.forEach((m) => m.setMap(null));
  }, [map, restaurants, navigate]);

  // ✅ 중심 이동
  useEffect(() => {
    if (!map) return;
    if (selectedRestaurant) {
      const moveTo = new window.kakao.maps.LatLng(
        selectedRestaurant.lat,
        selectedRestaurant.lng
      );
      map.panTo(moveTo);
    } else if (userPos) {
      map.setCenter(userPos);
    }
  }, [selectedRestaurant, userPos, map]);

  return (
    <div ref={mapRef} className="w-full h-full">
      {!window.kakao && (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
          지도 로드 중... (Kakao API 키 확인)
        </div>
      )}
    </div>
  );
};

// ✅ 페이지
export default function OffCampusPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const { favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  // ✅ 아이콘 필터 정의
  const FILTERS = [
    { id: "gluten_free", name: "Gluten-Free", icon: images.find(i => i.name.includes("gluten"))?.src },
    { id: "halal", name: "Halal", icon: images.find(i => i.name.includes("halal"))?.src },
    { id: "byo", name: "BYO", icon: images.find(i => i.name.includes("byo"))?.src },
    { id: "vegan", name: "Vegan", icon: images.find(i => i.name.includes("vegan"))?.src },
    { id: "local", name: "Local", icon: images.find(i => i.name.includes("local"))?.src },
  ];

  const handleFilterToggle = (filterId) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  // ✅ 페이지 로드 시 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ 데이터 로드
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // 백엔드 스펙: GET /restaurants
        const { data } = await api.get("/restaurants");
        if (data?.result?.restaurants?.length > 0) {
          // 학교 밖 식당만 필터링 (백엔드가 type 필드 추가하면 활용)
          setRestaurants(data.result.restaurants);
        } else {
          throw new Error("응답 비어 있음");
        }
      } catch (err) {
        console.error("❌ 식당 데이터 로드 실패:", err);
        setRestaurants([
          { restaurantId: 1, name: "양국", lat: 37.653, lng: 127.013, tags: ["local"] },
          { restaurantId: 2, name: "밀콩제면소", lat: 37.652, lng: 127.012, tags: ["vegan"] },
        ]);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(
    (r) =>
      activeFilters.length === 0 ||
      activeFilters.every((f) => r.tags?.includes(f))
  );

  const handleFavoriteClick = (e, restaurantId) => {
    e.stopPropagation();
    const isFavorite = favorites.some(f => f.restaurantId === restaurantId);
    toggleFavorite(restaurantId, isFavorite);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      {/* 왼쪽 패널 */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">학교 밖 식당</h1>

        {/* ✅ 필터 아이콘 */}
        <div className="flex flex-wrap gap-0 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterToggle(f.id)}
              className={`p-1 transition-all ${activeFilters.includes(f.id)
                ? "scale-110"
                : "opacity-70 hover:opacity-100"
                }`}
            >
              <img src={f.icon} alt={f.name} className="w-16 h-16 object-contain" />
            </button>
          ))}
        </div>

        <ul className="space-y-4">
          {filteredRestaurants.map((resto) => {
            const isFavorite = favorites.some(f => f.restaurantId === resto.restaurantId);
            return (
              <li
                key={resto.restaurantId}
                className={`border p-3 rounded-md flex justify-between items-center ${selectedRestaurant?.restaurantId === resto.restaurantId
                  ? "bg-lime-100 border-lime-500"
                  : "border-gray-200"
                  }`}
              >
                {/* 식당 이름 클릭 → 상세 페이지 이동 */}
                <span
                  onClick={() => navigate(`/detail/${resto.restaurantId}`)}
                  className="cursor-pointer hover:text-lime-700 hover:underline font-medium"
                >
                  {resto.name}
                </span>
                <div className="flex items-center gap-2">
                  {/* 지도 선택 버튼 */}
                  <button
                    onClick={() => setSelectedRestaurant(resto)}
                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    📍 지도
                  </button>
                  {/* 찜 버튼 */}
                  <button
                    onClick={(e) => handleFavoriteClick(e, resto.restaurantId)}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={isFavorite ? "찜 해제" : "찜하기"}
                  >
                    <img
                      src={isFavorite ? "/assets/restaurants/heart-filled.png" : "/assets/restaurants/heart-empty.png"}
                      alt={isFavorite ? "찜 해제" : "찜하기"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 오른쪽 지도 */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-full">
        <KakaoMap
          restaurants={filteredRestaurants}
          selectedRestaurant={selectedRestaurant}
        />
      </div>
    </div>
  );
}
