import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/client";
import { RESTAURANT_LIST } from "./api/endpoints";
import RestaurantCard from "./RestaurantCard.jsx";
import { images } from "./data/images";

const HomePage = () => {
  const [onCampusRestaurants, setOnCampusRestaurants] = useState([]);
  const [offCampusRestaurants, setOffCampusRestaurants] = useState([]);
  const navigate = useNavigate();

  const onCampusRef = useRef(null);
  const offCampusRef = useRef(null);

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // mainfood 이미지
  const mainFoodImage = images.find((i) => i.name === "mainfood")?.src;

  // 식당 목록 불러오기
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // 학식당 (ON_CAMPUS)
        const onCampusRes = await api.get(RESTAURANT_LIST, {
          params: { query: "ON_CAMPUS", page: 0, size: 10 }
        });
        console.log("🏫 학식당 API 응답:", onCampusRes.data);
        setOnCampusRestaurants(onCampusRes.data.result?.restaurants || []);

        // 학교 밖 식당 (OFF_CAMPUS)
        const offCampusRes = await api.get(RESTAURANT_LIST, {
          params: { query: "OFF_CAMPUS", page: 0, size: 22 }
        });
        console.log("🍽️ 학교 밖 식당 API 응답:", offCampusRes.data);
        setOffCampusRestaurants(offCampusRes.data.result?.restaurants || []);

      } catch (error) {
        console.error(
          "❌ 식당 목록을 불러오는 중 오류 발생:",
          error.response?.status,
          error.response?.data
        );
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      {/* --- 1. 오늘 뭐 먹지? --- */}
      <div style={{ backgroundColor: '#FDFFE5' }}>
        <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center justify-center">
            {/* 왼쪽 텍스트 */}
            <div className="flex flex-col justify-center items-start text-left space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800">
                오늘 뭐 먹지?
              </h1>

              {/* 버튼 세로 배치 */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => scrollToRef(onCampusRef)}
                  className="px-10 py-3 text-white font-semibold rounded-full shadow-md hover:opacity-90 transition-all text-lg"
                  style={{ backgroundColor: '#C9D267' }}
                >
                  학식당
                </button>

                <button
                  onClick={() => scrollToRef(offCampusRef)}
                  className="px-10 py-3 bg-white font-semibold rounded-full border-2 shadow-sm hover:bg-gray-50 transition-all text-lg"
                  style={{ borderColor: '#C9D267', color: '#C9D267' }}
                >
                  학교 밖 식당
                </button>
              </div>
            </div>

            {/* 오른쪽: mainfood.png 사용 */}
            <div className="flex justify-center md:justify-start">
              <img
                src={mainFoodImage}
                alt="메인 음식"
                className="rounded-full w-80 h-80 lg:w-96 lg:h-96 object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. Find the place! (그림자 박스) --- */}
      <div className="py-8 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="bg-white rounded-2xl shadow-lg py-8 px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
                <span className="text-4xl sm:text-5xl">📍</span>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-800">Find the place!</h3>
                  <p className="text-gray-500 text-sm">
                    Promise To Deliver Within 30 Mins
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
                <span className="text-4xl sm:text-5xl" style={{ color: '#C9D267' }}>✓</span>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-800">Select the icon</h3>
                  <p className="text-gray-500 text-sm">
                    Your Food Will Be Delivered 100% Fresh To Your Home.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300">
                <span className="text-4xl sm:text-5xl">💬</span>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-800">Share</h3>
                  <p className="text-gray-500 text-sm">
                    Your Food Delivery Is Absolutely Free. No Cost Just Order
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. 학식당 --- */}
      <div ref={onCampusRef} className="py-16" style={{ backgroundColor: '#FDFFE5' }}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">학식당</h2>
            <button
              onClick={() => navigate("/menu")}
              className="px-6 py-2 text-white font-semibold rounded-full shadow-md hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out"
              style={{ backgroundColor: '#C9D267' }}
            >
              See All
            </button>
          </div>

          {/* 렌더링 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {onCampusRestaurants.map((resto) => (
              <RestaurantCard key={resto.restaurantId} restaurant={resto} />
            ))}
          </div>
        </div>
      </div>

      {/* --- 4. 학교 밖 식당 --- */}
      <div ref={offCampusRef} className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">학교 밖 식당</h2>

            <button
              onClick={() => navigate("/offcampus")}
              className="px-6 py-2 text-white font-semibold rounded-full shadow-md hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out"
              style={{ backgroundColor: '#C9D267' }}
            >
              See All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offCampusRestaurants.map((resto) => (
              <RestaurantCard key={resto.restaurantId} restaurant={resto} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
