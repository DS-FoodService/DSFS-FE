import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api from "./api/client";

export default function MyPage() {
  const { user, favorites, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews"); // reviews, favorites, account

  // 페이지 로드 시 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 내 리뷰 불러오기
  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const { data } = await api.get("/reviews", {
          params: { query: "all", page: 0, size: 50 }
        });
        setReviews(data?.result?.reviews || []);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
      }
    };
    fetchMyReviews();
  }, []);

  // 찜한 식당 목록 불러오기
  useEffect(() => {
    const fetchFavoriteRestaurants = async () => {
      try {
        const { data } = await api.get("/restaurants");
        const allRestaurants = data?.result?.restaurants || [];
        // 찜 목록에 있는 식당만 필터링
        const favRestaurants = allRestaurants.filter(r =>
          favorites.some(f => f.restaurantId === r.restaurantId)
        );
        setRestaurants(favRestaurants);
      } catch (err) {
        console.error("식당 목록 불러오기 실패:", err);
      }
    };
    if (favorites.length > 0) {
      fetchFavoriteRestaurants();
    }
  }, [favorites]);

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // 로그인 안 되어 있으면 로그인 페이지로
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-600">로그인이 필요합니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">마이페이지</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          로그아웃
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === "reviews"
              ? "text-lime-600 border-b-2 border-lime-600"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          내 리뷰
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === "favorites"
              ? "text-lime-600 border-b-2 border-lime-600"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          찜한 식당
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === "account"
              ? "text-lime-600 border-b-2 border-lime-600"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          계정 정보
        </button>
      </div>

      {/* 내 리뷰 탭 */}
      {activeTab === "reviews" && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            내가 작성한 리뷰 ({reviews.length}개)
          </h2>
          {reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.reviewId} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{r.score}</span>
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
              작성한 리뷰가 없습니다.
            </div>
          )}
        </section>
      )}

      {/* 찜한 식당 탭 */}
      {activeTab === "favorites" && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            찜한 식당 ({favorites.length}개)
          </h2>
          {favorites.length > 0 ? (
            <ul className="space-y-3">
              {restaurants.length > 0 ? (
                restaurants.map((r) => (
                  <li
                    key={r.restaurantId}
                    onClick={() => navigate(`/detail/${r.restaurantId}`)}
                    className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 cursor-pointer hover:bg-lime-50 transition-colors flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{r.name}</p>
                      <p className="text-sm text-gray-500">
                        ⭐ {r.score ?? 0} ({r.reviewCount ?? 0}개 리뷰)
                      </p>
                    </div>
                    <span className="text-lime-600">→</span>
                  </li>
                ))
              ) : (
                favorites.map((f) => (
                  <li
                    key={f.restaurantId}
                    onClick={() => navigate(`/detail/${f.restaurantId}`)}
                    className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 cursor-pointer hover:bg-lime-50 transition-colors flex justify-between items-center"
                  >
                    <p className="font-semibold text-gray-800">식당 #{f.restaurantId}</p>
                    <span className="text-lime-600">→</span>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">
              찜한 식당이 없습니다.
            </div>
          )}
        </section>
      )}

      {/* 계정 정보 탭 */}
      {activeTab === "account" && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">계정 정보</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <p className="text-lg font-medium text-gray-800">
                  {user?.email || "이메일 정보 없음"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">가입 상태</p>
                <p className="text-lg font-medium text-green-600">로그인됨 ✓</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
