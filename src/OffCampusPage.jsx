// OffCampusPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext.jsx';
import { images } from "./data/images";

import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

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

const KAKAO_APP_KEY = '8668be1b8e7bcc2a3ba8e26af8f107c6';

const KakaoMap = ({ restaurants, selectedRestaurant, toggleFavorite, favorites }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapRef.current || map) return;

      const kakaoMap = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 4,
      });

      setMap(kakaoMap);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const userPos = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          kakaoMap.setCenter(userPos);

          new window.kakao.maps.Marker({
            map: kakaoMap,
            position: userPos,
            title: '내 위치',
          });
        });
      }
    };

    if (!document.getElementById("kakao-maps-script")) {
      const script = document.createElement("script");
      script.id = "kakao-maps-script";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing&autoload=false`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    const markers = restaurants.map((resto) => {
      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(resto.lat, resto.lng),
        title: resto.name,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        toggleFavorite(resto.id, favorites.includes(resto.id));
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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const { favorites, toggleFavorite } = useAuth();

  const handleFilterToggle = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const OFF_CAMPUS_FILTERS = [
    { id: "gluten_free", name: "Gluten-Free", icon: images.find(i => i.name === "gluten")?.src },
    { id: "halal", name: "Halal", icon: images.find(i => i.name === "halal")?.src },
    { id: "byo", name: "BYO", icon: images.find(i => i.name === "byo")?.src },
    { id: "vegan", name: "Vegan", icon: images.find(i => i.name === "vegan")?.src },
    { id: "local", name: "Local", icon: images.find(i => i.name === "local")?.src },
  ];

  const allOffCampusRestaurants = [
    { id: 'resto_20', name: '포36거리', rating: 4.7, reviewCount: 100, tags: ['halal', 'byo'], menus: [{ name: '쌀국수' }, { name: '분짜' }], lat: 37.6521, lng: 127.0170 },
    { id: 'resto_6', name: '엘수에뇨', rating: 4.6, reviewCount: 50, tags: ['vegan', 'halal', 'byo'], menus: [{ name: '파스타' }, { name: '샐러드' }], lat: 37.6510, lng: 127.0165 },
    { id: 'resto_5', name: '사리원', rating: 4.3, reviewCount: 80, tags: ['local'], menus: [{ name: '냉면' }, { name: '갈비탕' }], lat: 37.6515, lng: 127.0150 },
  ];

  const filteredRestaurants = allOffCampusRestaurants.filter((resto) => {
    const s = searchTerm.toLowerCase();
    return (
      (resto.name.toLowerCase().includes(s) ||
        resto.menus.some((m) => m.name.toLowerCase().includes(s))) &&
      (activeFilters.length === 0 || activeFilters.every((id) => resto.tags.includes(id)))
    );
  });

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">

      <div className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">학교 밖 식당</h1>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="식당 또는 메뉴 검색..."
          className="w-full pl-10 pr-4 py-3 mb-4 border-2 border-gray-200 rounded-full"
        />

        {/* 필터 아이콘 */}
       <div className="flex flex-wrap gap-3 mb-6">
  {OFF_CAMPUS_FILTERS.map((f) => (
    <button
      key={f.id}
      onClick={() => handleFilterToggle(f.id)}
      className={`
        p-1 transition-all
        ${activeFilters.includes(f.id)
          ? "scale-110"     // 선택되면 살짝 커지는 효과
          : "opacity-70 hover:opacity-100" // 비활성화일 때 흐리게
        }
      `}
    >
      {/* 동그라미 없이 아이콘만 */}
      <img
        src={f.icon}
        alt={f.name}
        className="w-14 h-14 object-contain"  
      />
    </button>
  ))}
</div>


        {selectedRestaurant && <RestaurantSection restaurant={selectedRestaurant} />}

        <div className="space-y-4">
          {filteredRestaurants.map((resto) => (
            <div
              key={resto.id}
              className={`p-3 border rounded-md cursor-pointer ${
                selectedRestaurant?.id === resto.id ? 'border-lime-500 bg-lime-100' : 'border-gray-200'
              }`}
              onClick={() => setSelectedRestaurant(resto)}
            >
              <h2 className="font-bold">{resto.name}</h2>
              <p className="text-sm text-gray-500">{resto.menus.map((m) => m.name).join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

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
