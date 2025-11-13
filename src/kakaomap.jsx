import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const KAKAO_APP_KEY = "8668be1b8e7bcc2a3ba8e26af8f107c6";

const KakaoMap = ({ restaurants, selectedRestaurant }) => {
  const mapContainer = useRef(null);
  const [kakaoMap, setKakaoMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userPos, setUserPos] = useState(null); // ✅ 내 위치 저장
  const navigate = useNavigate();

  // ✅ 지도 초기화
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !mapContainer.current) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.6514, 127.0160), // 초기 중심 (덕성여대)
      level: 4,
    };

    const map = new window.kakao.maps.Map(mapContainer.current, options);
    setKakaoMap(map);

    // ✅ 내 위치 불러오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const myLatLng = new window.kakao.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setUserPos(myLatLng);

          // 내 위치 마커 표시 (파란색 기본 마커)
          new window.kakao.maps.Marker({
            position: myLatLng,
            map,
          });

          // 지도 중심을 내 위치로 이동
          map.setCenter(myLatLng);
        },
        (err) => {
          console.warn("⚠️ 위치 접근 실패:", err);
        }
      );
    }
  }, []);

  // ✅ 식당 마커 표시
  useEffect(() => {
    if (!kakaoMap || !window.kakao) return;

    // 이전 마커 제거
    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = restaurants
      .map((resto) => {
        if (!resto.lat || !resto.lng) return null;

        const position = new window.kakao.maps.LatLng(resto.lat, resto.lng);
        const marker = new window.kakao.maps.Marker({
          position,
          title: resto.name,
        });

        // ✅ 마커 클릭 시 상세 페이지 이동
        window.kakao.maps.event.addListener(marker, "click", () => {
          navigate(`/detail/${resto.id}`);
        });

        marker.setMap(kakaoMap);
        return marker;
      })
      .filter(Boolean);

    setMarkers(newMarkers);
  }, [kakaoMap, restaurants]);

  // ✅ 선택된 식당 or 내 위치 기준으로 지도 이동
  useEffect(() => {
    if (!kakaoMap) return;

    if (selectedRestaurant) {
      const pos = new window.kakao.maps.LatLng(
        selectedRestaurant.lat,
        selectedRestaurant.lng
      );
      kakaoMap.panTo(pos);
    } else if (userPos) {
      kakaoMap.panTo(userPos); // 선택 안 했으면 내 위치 중심
    }
  }, [kakaoMap, selectedRestaurant, userPos]);

  return (
    <div
      id="map"
      ref={mapContainer}
      className="w-full h-full min-h-[400px] md:min-h-0"
    >
      {!window.kakao && (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
          지도 로드 중... (Kakao API 키 확인 필요)
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
