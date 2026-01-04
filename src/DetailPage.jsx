import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "./api/client";
import { AuthContext } from "./AuthContext";
import ReviewForm from "./ReviewForm";
import { images } from "./data/images";

const KAKAO_APP_KEY = "8668be1b8e7bcc2a3ba8e26af8f107c6";

// 아이콘 데이터
const DIETARY_ICONS = [
  { id: "gluten_free", name: "Gluten-Free", icon: "/assets/restaurants/gluten.png" },
  { id: "halal", name: "Halal", icon: "/assets/restaurants/halal.png" },
  { id: "byo", name: "BYO", icon: "/assets/restaurants/byo.png" },
  { id: "vegan", name: "Vegan", icon: "/assets/restaurants/vegan.png" },
  { id: "local", name: "Local", icon: "/assets/restaurants/local.png" },
];

// 카카오 지도 컴포넌트
const RestaurantMap = ({ lat, lng, name }) => {
  const mapRef = useRef(null);

  // 덕성여대 기본 좌표
  const DEFAULT_LAT = 37.6514;
  const DEFAULT_LNG = 127.016;
  const displayLat = lat || DEFAULT_LAT;
  const displayLng = lng || DEFAULT_LNG;

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;

      const kakao = window.kakao;
      if (!kakao?.maps?.LatLng) {
        console.warn("카카오맵 SDK가 아직 로드되지 않았습니다");
        return;
      }

      const position = new kakao.maps.LatLng(displayLat, displayLng);
      const map = new kakao.maps.Map(mapRef.current, {
        center: position,
        level: 3,
      });

      // 마커 생성
      const marker = new kakao.maps.Marker({
        position: position,
        map: map,
      });

      // 인포윈도우 생성
      const infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${name || '식당'}</div>`,
      });
      infowindow.open(map, marker);
    };

    // 카카오맵 SDK가 로드될 때까지 대기
    if (window.kakao?.maps?.load) {
      window.kakao.maps.load(initMap);
    } else if (window.kakao?.maps?.LatLng) {
      // 이미 로드된 경우
      initMap();
    } else {
      // SDK가 아직 없으면 잠시 후 재시도
      const timer = setTimeout(() => {
        if (window.kakao?.maps?.load) {
          window.kakao.maps.load(initMap);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [displayLat, displayLng, name]);

  return <div ref={mapRef} className="w-full h-64 rounded-lg shadow-md" />
};

export default function DetailPage() {
  const { restaurantId } = useParams();
  const { toggleFavorite, favorites } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const isFav = favorites.some(f => f.restaurantId === Number(restaurantId));
    setIsLiked(isFav);
  }, [favorites, restaurantId]);

  // 식당 상세 정보 불러오기
  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        // API에서 상세 정보 불러오기
        const { data } = await api.get(`/restaurants/${restaurantId}`);
        console.log("식당 상세 정보:", data);
        const r = data.result?.restaurant || data.result;
        const menus = data.result?.menus || r?.menus || [];
        // 메뉴들에서 icons 수집 (중복 제거)
        const menuIcons = [...new Set(menus.flatMap(m => m.icons || []))];
        console.log("🏷️ 아이콘 필드:", { tags: r?.tags, icons: r?.icons, menuIcons });
        if (r) {
          // 덕성여자대학교 기본 좌표
          const DEFAULT_LAT = 37.6514;
          const DEFAULT_LNG = 127.016;

          setRestaurant({
            ...r,
            lat: r.latitude || r.lat || DEFAULT_LAT,
            lng: r.longitude || r.lng || DEFAULT_LNG,
            tags: r.icons || r.tags || menuIcons,  // restaurant icons -> tags -> menu icons 순으로 체크
            menus: menus,
          });
        } else {
          throw new Error("No restaurant data");
        }
      } catch (err) {
        console.error("식당 상세 정보 실패, 목록에서 검색:", err);

        // 실패 시 전체 목록에서 찾기
        try {
          const { data: listData } = await api.get("/restaurants");
          const allRestaurants = listData.result?.restaurants || [];
          const found = allRestaurants.find(r => r.restaurantId === Number(restaurantId));

          if (found) {
            setRestaurant({
              name: found.name,
              address: found.address || "주소 정보 없음",
              lat: found.latitude || found.lat || 37.6514,
              lng: found.longitude || found.lng || 127.016,
              tags: found.tags || found.icons || [],
              menus: found.menus || [],
              score: found.score,
              reviewCount: found.reviewCount,
            });
          } else {
            // 둘 다 실패하면 임시 데이터
            setRestaurant({
              name: `식당 ${restaurantId}`,
              address: "주소 정보 없음",
              lat: 37.6514,
              lng: 127.016,
              tags: ["vegan", "local"],
              menus: [],
            });
          }
        } catch (listErr) {
          console.error("목록에서도 검색 실패:", listErr);
          setRestaurant({
            name: `식당 ${restaurantId}`,
            address: "주소 정보 없음",
            lat: 37.6514,
            lng: 127.016,
            tags: [],
            menus: [],
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetail();
  }, [restaurantId]);

  useEffect(() => {
    fetchReviews();
  }, [restaurantId]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get("/reviews", {
        params: {
          query: "restaurant",
          r_id: restaurantId,
          page,
          size,
        },
      });
      setReviews(data.result?.reviews || []);
    } catch (err) {
      console.error("리뷰 목록 불러오기 실패:", err);
    }
  };

  const handleLikeClick = async () => {
    await toggleFavorite(restaurantId, isLiked);
    setIsLiked(!isLiked); // ✅ 로컬 상태도 업데이트
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더: 식당 이름 + 찜 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {restaurant?.name || `식당 ${restaurantId}`}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleLikeClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
          >
            <img
              src={isLiked ? "/assets/restaurants/heart-filled.png" : "/assets/restaurants/heart-empty.png"}
              alt={isLiked ? "찜 해제" : "찜하기"}
              className="w-6 h-6"
            />
            <span>{isLiked ? "찜 해제" : "찜하기"}</span>
          </button>
          <Link
            to="/myreviews"
            className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
          >
            내 리뷰 보기
          </Link>
        </div>
      </div>

      {/* 아이콘 섹션 */}
      {restaurant?.tags && restaurant.tags.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">식당 특징</h2>
          <div className="flex flex-wrap gap-4">
            {restaurant.tags.map((tagId) => {
              const icon = DIETARY_ICONS.find(i => i.id === tagId.toLowerCase());
              if (!icon) return null;
              return (
                <img key={tagId} src={icon.icon} alt={icon.name} className="w-20 h-20 object-contain" />
              );
            })}
          </div>
        </section>
      )}

      {/* 메뉴 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">메뉴</h2>
        {restaurant?.menus && restaurant.menus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurant.menus.map((menu, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* 메뉴 이미지 */}
                {menu.imgUrl && (
                  <img
                    src={menu.imgUrl}
                    alt={menu.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                {/* 메뉴 정보 */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg">{menu.name}</h3>
                  <p className="text-lime-600 font-bold mt-1">
                    {menu.price ? `${menu.price.toLocaleString()}원` : "-"}
                  </p>
                  {/* 메뉴별 아이콘 */}
                  {menu.icons && menu.icons.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {menu.icons.map((iconId, i) => {
                        const icon = DIETARY_ICONS.find(d => d.id === iconId.toLowerCase());
                        return icon ? (
                          <img key={i} src={icon.icon} alt={icon.name} className="w-6 h-6 object-contain" />
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
            메뉴 정보가 없습니다. (백엔드 연동 후 표시됩니다)
          </div>
        )}
      </section>

      {/* 지도 섹션 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">위치</h2>
        {restaurant?.address && (
          <p className="text-gray-600 mb-3">📍 {restaurant.address}</p>
        )}
        <RestaurantMap
          lat={restaurant?.lat}
          lng={restaurant?.lng}
          name={restaurant?.name}
        />
      </section>

      {/* 리뷰 작성 폼 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">리뷰 작성</h2>
        <ReviewForm restaurantId={restaurantId} onReviewAdded={fetchReviews} />
      </section>

      {/* 리뷰 목록 */}
      <section>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          리뷰 ({reviews.length}개)
        </h3>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.reviewId} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{r.score}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-sm text-gray-500">{r.author}</span>
                </div>
                <p className="text-gray-700">{r.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
            아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
          </div>
        )}
      </section>
    </div>
  );
}
