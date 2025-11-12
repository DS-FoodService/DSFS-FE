import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext.jsx";
import { images } from "./data/images";
import axios from "axios";
import { API_BASE_URL } from "./config";

// 리뷰 UI
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

const KAKAO_APP_KEY = "8668be1b8e7bcc2a3ba8e26af8f107c6";

function RestaurantSection({ restaurant }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">{restaurant.name}</h2>
      <ReviewForm restaurantId={restaurant.id} onCreated={() => setRefreshKey(k => k + 1)} />
      <div key={refreshKey}>
        <ReviewList restaurantId={restaurant.id} />
      </div>
    </div>
  );
}

const KakaoMap = ({ restaurants, selectedRestaurant, toggleFavorite, favorites }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao?.maps || !mapRef.current || map) return;

      const kakaoMap = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 4,
      });

      setMap(kakaoMap);

      // 내 위치
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const userPos = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          kakaoMap.setCenter(userPos);
          new window.kakao.maps.Marker({ map: kakaoMap, position: userPos });
        });
      }
    };

    if (!document.getElementById("kakao-maps-sdk")) {
      const script = document.createElement("script");
      script.id = "kakao-maps-sdk";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services,clusterer`;
      script.async = true;
      script.onload = () => window.kakao.maps.load(loadMap);
      document.head.appendChild(script);
    } else {
      window.kakao.maps.load(loadMap);
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    const markers = restaurants.map((resto) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(resto.lat, resto.lng),
        map,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        toggleFavorite(resto.id);
      });

      return marker;
    });

    return () => markers.forEach((m) => m.setMap(null));
  }, [restaurants, map]);

  useEffect(() => {
    if (!map || !selectedRestaurant) return;
    map.panTo(new window.kakao.maps.LatLng(selectedRestaurant.lat, selectedRestaurant.lng));
  }, [selectedRestaurant, map]);

  return <div ref={mapRef} className="w-full h-full" />;
};

const OffCampusPage = ({ setPage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const { favorites, toggleFavorite } = useAuth(); // AuthContext에서 가져옴

  // 식당 데이터 불러오기
  useEffect(() => {
  const fetchRestaurants = async () => {
    const { data } = await api.get(RESTAURANTS);
    setRestaurants(data.result);
  };

  fetchRestaurants();
}, []);

  const FILTERS = [
    { id: "gluten_free", icon: images.find(i => i.name === "gluten")?.src },
    { id: "halal",        icon: images.find(i => i.name === "halal")?.src },
    { id: "byo",          icon: images.find(i => i.name === "byo")?.src },
    { id: "vegan",        icon: images.find(i => i.name === "vegan")?.src },
    { id: "local",        icon: images.find(i => i.name === "local")?.src },
  ];

  const filteredRestaurants = restaurants.filter((resto) => (
    (!searchTerm || resto.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeFilters.length === 0 || activeFilters.every((id) => resto.tags.includes(id)))
  ));

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">

      {/* 왼쪽 패널 */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">학교 밖 식당</h1>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="식당 또는 메뉴 검색..."
          className="w-full pl-10 pr-4 py-3 mb-4 border-2 rounded-full"
        />

        {/* 필터 아이콘 */}
        <div className="flex flex-wrap gap-3 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() =>
                setActiveFilters((prev) => prev.includes(f.id) ? prev.filter((x) => x !== f.id) : [...prev, f.id])
              }
              className={`${activeFilters.includes(f.id) ? "scale-110" : "opacity-75 hover:opacity-100"} transition`}
            >
              <img src={f.icon} className="w-14 h-14" />
            </button>
          ))}
        </div>

        {selectedRestaurant && <RestaurantSection restaurant={selectedRestaurant} />}

        {/* 식당 목록 */}
        <div className="space-y-4">
          {filteredRestaurants.map((resto) => (
            <div
              key={resto.id}
              className={`p-3 border rounded-md cursor-pointer ${
                selectedRestaurant?.id === resto.id ? "border-lime-500 bg-lime-100" : "border-gray-200"
              }`}
              onClick={() => setSelectedRestaurant(resto)}
            >
              <h2 className="font-bold">{resto.name}</h2>
              <p className="text-sm text-gray-500">{resto.tags.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 지도 */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-full">
        <KakaoMap
          restaurants={filteredRestaurants}
          selectedRestaurant={selectedRestaurant}
          toggleFavorite={toggleFavorite}
          favorites={favorites}
        />
      </div>

    </div>
  );
};

export default OffCampusPage;
