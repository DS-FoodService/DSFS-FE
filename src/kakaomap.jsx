const KakaoMap = ({ restaurants, selectedRestaurant }) => {
  const mapContainer = useRef(null);
  const [kakaoMap, setKakaoMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps && mapContainer.current) {
      const options = {
        center: new window.kakao.maps.LatLng(37.6514, 127.0160),
        level: 4,
      };
      const map = new window.kakao.maps.Map(mapContainer.current, options);
      setKakaoMap(map);
    }
  }, []);

  useEffect(() => {
    if (!kakaoMap || !window.kakao) return;
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers = restaurants.map(resto => {
      const position = new window.kakao.maps.LatLng(resto.lat, resto.lng);
      const marker = new window.kakao.maps.Marker({
        position: position,
        title: resto.name
      });
      marker.setMap(kakaoMap);
      return marker;
    });
    setMarkers(newMarkers);
  }, [kakaoMap, restaurants]);

  useEffect(() => {
    if (!kakaoMap || !selectedRestaurant) return;
    const position = new window.kakao.maps.LatLng(selectedRestaurant.lat, selectedRestaurant.lng);
    kakaoMap.panTo(position);
  }, [kakaoMap, selectedRestaurant]);

  return (
    <div 
      id="map" 
      ref={mapContainer} 
      className="w-full h-full min-h-[400px] md:min-h-0"
    >
      {!window.kakao && <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">지도 로드 중... (Kakao API 키 확인 필요)</div>}
    </div>
  );
};