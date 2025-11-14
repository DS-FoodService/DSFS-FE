import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/client";
import RestaurantCard from "./RestaurantCard";
import { images } from "./data/images";

export default function HomePage() {
  const [onCampus, setOnCampus] = useState([]);
  const [offCampus, setOffCampus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const onCampusRef = useRef(null);
  const offCampusRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const mainFoodImage = images.find((i) => i.name === "mainfood")?.src;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const [onData, offData] = await Promise.all([
          api.get("/restaurants", { params: { query: "ON_CAMPUS", page: 0, size: 3 } }),
          api.get("/restaurants", { params: { query: "OFF_CAMPUS", page: 0, size: 3 } }),
        ]);
        setOnCampus(onData.data.result?.restaurants || []);
        setOffCampus(offData.data.result?.restaurants || []);
      } catch (err) {
        console.error("❌ 홈 식당 데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        로딩 중...
      </div>
    );

  return (
    <div className="bg-lime-50/30">
      {/* Hero */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col justify-center items-start text-left space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800">
              오늘 뭐 먹지?
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => scrollToRef(onCampusRef)}
                className="px-10 py-3 bg-lime-200 text-lime-900 font-semibold rounded-full shadow-md hover:bg-lime-300 transition-all text-lg"
              >
                학식당
              </button>
              <button
                onClick={() => scrollToRef(offCampusRef)}
                className="px-10 py-3 bg-white text-gray-700 font-semibold rounded-full border border-gray-300 shadow-sm hover:bg-gray-100 transition-all text-lg"
              >
                학교 밖 식당
              </button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src={mainFoodImage}
              alt="메인 음식"
              className="rounded-full w-80 h-80 lg:w-96 lg:h-96 object-cover shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* 학식당 섹션 */}
      <div ref={onCampusRef} className="py-16 bg-lime-50/30">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">학식당</h2>
            <button
              onClick={() => navigate("/menu")}
              className="px-6 py-2 bg-gradient-to-r from-lime-200 to-lime-400 text-lime-900 font-semibold rounded-full shadow-md hover:from-lime-300 hover:to-lime-500 transition-all"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {onCampus.map((resto) => (
              <RestaurantCard key={resto.restaurantId} restaurant={resto} />
            ))}
          </div>
        </div>
      </div>

      {/* 학교 밖 식당 섹션 */}
      <div ref={offCampusRef} className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">학교 밖 식당</h2>
            <button
              onClick={() => navigate("/offcampus")}
              className="px-6 py-2 bg-gradient-to-r from-lime-200 to-lime-400 text-lime-900 font-semibold rounded-full shadow-md hover:from-lime-300 hover:to-lime-500 transition-all"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offCampus.map((resto) => (
              <RestaurantCard key={resto.restaurantId} restaurant={resto} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
