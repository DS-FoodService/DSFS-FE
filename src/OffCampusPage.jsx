// OffCampusPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext.jsx'; // 즐겨찾기 토글용

// --- 카카오 JS 키 입력 ---
const KAKAO_APP_KEY = '8668be1b8e7bcc2a3ba8e26af8f107c6';

// 필터 정의
const OFF_CAMPUS_FILTERS = [
  { id: 'gluten_free', name: 'Gluten-Free', icon: '🌾' },
  { id: 'halal', name: 'Halal', icon: '🕌' },
  { id: 'byo', name: 'BYO', icon: '🍼' },
  { id: 'vegan', name: 'Vegan', icon: '🌿' },
  { id: 'local', name: 'Local', icon: '📍' },
];

// 임시 데이터
const allOffCampusRestaurants = [
  { id: 'resto_20', name: '포36거리', rating: 4.7, reviewCount: 100, tags: ['halal', 'byo'], menus: [{ name: '쌀국수' }, { name: '분짜' }], lat: 37.6521, lng: 127.0170 },
  { id: 'resto_6', name: '엘수에뇨', rating: 4.6, reviewCount: 50, tags: ['vegan', 'halal', 'byo'], menus: [{ name: '파스타' }, { name: '샐러드' }], lat: 37.6510, lng: 127.0165 },
  { id: 'resto_5', name: '사리원', rating: 4.3, reviewCount: 80, tags: ['local'], menus: [{ name: '냉면' }, { name: '갈비탕' }], lat: 37.6515, lng: 127.0150 },
];

// KakaoMap 컴포넌트
const KakaoMap = ({ restaurants, selectedRestaurant, toggleFavorite, favorites }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!document.getElementById('kakao-maps-script')) {
      const script = document.createElement('script');
      script.id = 'kakao-maps-script';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,clusterer,drawing&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = initMap;
    } else {
      initMap();
    }

    function initMap() {
      if (!window.kakao || !window.kakao.maps) return;

      const options = { center: new window.kakao.maps.LatLng(37.5665, 126.9780), level: 4 };
      const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
      setMap(kakaoMap);

      // 사용자 위치 표시
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const userPos = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          kakaoMap.setCenter(userPos);

          new window.kakao.maps.Marker({
            map: kakaoMap,
            position: userPos,
            title: '내 위치',
            image: new window.kakao.maps.MarkerImage('https://placehold.co/40x40/00f/fff?text=ME', new window.kakao.maps.Size(40, 40)),
          });
        });
      }

      // 장소 마커
      restaurants.forEach((resto) => {
        const marker = new window.kakao.maps.Marker({
          map: kakaoMap,
          position: new window.kakao.maps.LatLng(resto.lat, resto.lng),
          title: resto.name,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          toggleFavorite(resto.id, favorites.includes(resto.id));
          alert(`${resto.name} 즐겨찾기 ${favorites.includes(resto.id) ? '해제' : '추가'}`);
        });
      });
    }
  }, [restaurants, favorites, toggleFavorite]);

  return <div ref={mapRef} className="w-full h-full" />;
};

// OffCampusPage 메인
const OffCampusPage = ({ setPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const { favorites, toggleFavorite } = useAuth();

  const handleFilterToggle = (filterId) => {
    setActiveFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  const filteredRestaurants = allOffCampusRestaurants.filter((resto) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = resto.name.toLowerCase().includes(searchLower) || resto.menus.some((m) => m.name.toLowerCase().includes(searchLower));
    const matchesFilters = activeFilters.length === 0 || activeFilters.every((id) => resto.tags.includes(id));
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">학교 밖 식당</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="식당 또는 메뉴 검색..."
          className="w-full pl-10 pr-4 py-3 mb-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-lime-500"
        />
        <div className="flex flex-wrap gap-2 mb-6">
          {OFF_CAMPUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterToggle(f.id)}
              className={`flex items-center gap-1 px-3 py-1.5 border-2 rounded-full text-xs font-semibold transition-all ${
                activeFilters.includes(f.id) ? 'bg-lime-200 border-lime-300 text-lime-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{f.icon}</span>
              {f.name}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {filteredRestaurants.length ? (
            filteredRestaurants.map((resto) => (
              <div
                key={resto.id}
                className={`p-3 border rounded-md cursor-pointer ${
                  selectedRestaurant?.id === resto.id ? 'border-lime-500' : 'border-gray-200'
                }`}
                onClick={() => setSelectedRestaurant(resto)}
              >
                <h2 className="font-bold">{resto.name}</h2>
                <p className="text-sm text-gray-500">{resto.menus.map((m) => m.name).join(', ')}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
      <div className="w-full md:w-2/3 lg:w-3/4 h-full">
        <KakaoMap restaurants={filteredRestaurants} selectedRestaurant={selectedRestaurant} toggleFavorite={toggleFavorite} favorites={favorites} />
      </div>
    </div>
  );
};

export default OffCampusPage;
