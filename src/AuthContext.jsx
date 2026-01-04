// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "./api/client";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  /* 로그인 */
  const login = async (email, password, navigate) => {
    try {
      // api 클라이언트 사용 (프록시를 통해 요청)
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data?.result?.accessToken || res.data?.accessToken || res.data?.token;
      if (!token) throw new Error("토큰이 응답에 없습니다.");

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email); // ✅ 이메일도 저장
      setUser({ email });

      // 로그인 후 북마크 목록 불러오기
      await fetchFavorites();

      alert("로그인 성공!");
      if (navigate) navigate("/"); // ✅ 로그인 후 홈으로 이동

    } catch (err) {
      console.error("❌ 로그인 실패:", err);
      alert("로그인 실패. 이메일/비밀번호를 확인하세요.");
      throw err;
    }
  };

  /* 회원가입 */
  const signup = async (email, password) => {
    try {
      await api.post("/auth/signup", {
        email,
        password,
      });
      alert("회원가입 완료! 로그인 해주세요.");
    } catch (err) {
      alert(err.response?.data?.message || "회원가입 중 오류 발생");
      throw err;
    }
  };

  /* 찜 목록 불러오기 */
  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await api.get("/bookmark", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 찜 목록 응답:", data);

      // ✅ 찜 데이터는 result.restaurants 배열에 있음
      const bookmarks = data?.result?.restaurants || [];
      console.log("📌 북마크 배열 (첫번째 아이템):", bookmarks[0]); // 구조 확인용

      if (bookmarks.length) {
        const mappedFavorites = bookmarks.map((b) => ({
          restaurantId: b.restaurantId,
          // 여러 가능한 필드명 시도
          bookmarkId: b.bookmarkId || b.bookmark_id || b.id || b.bookMarkedId
        }));
        console.log("📌 매핑된 favorites:", mappedFavorites);
        setFavorites(mappedFavorites);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.warn("⚠️ 찜 목록 불러오기 실패:", err);
    }
  };

  /* 찜 토글 */
  const toggleFavorite = async (restaurantId, isCurrentlyFavorite) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인 후 이용해주세요.");

    console.log("🔄 찜 토글:", { restaurantId, isCurrentlyFavorite, favorites });

    try {
      if (isCurrentlyFavorite) {
        // ✅ 찜 삭제: DELETE /api/bookmark/{bookmarkId}
        const bookmark = favorites.find(f => f.restaurantId === Number(restaurantId));
        console.log("🗑️ 삭제할 북마크:", bookmark);

        if (bookmark?.bookmarkId) {
          const deleteRes = await api.delete(`/bookmark/${bookmark.bookmarkId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("🗑️ 삭제 응답:", deleteRes.data);
        } else {
          console.warn("⚠️ bookmarkId가 없어서 삭제 불가!");
        }
        setFavorites((prev) => prev.filter((f) => f.restaurantId !== Number(restaurantId)));
      } else {
        // ✅ 찜 등록: POST /api/bookmark with body
        const { data } = await api.post(
          "/bookmark",
          { restaurantId: Number(restaurantId) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ 찜 등록 응답:", data);
        setFavorites((prev) => [...prev, {
          restaurantId: Number(restaurantId),
          bookmarkId: data?.result?.bookmarkId || data?.result?.id
        }]);
      }
    } catch (err) {
      console.error("❌ 찜 토글 실패:", err);
      alert("찜 상태를 변경할 수 없습니다.");
    }
  };

  /* 로그아웃 */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setFavorites([]);
  };

  /* 자동 로그인 유지 (페이지 새로고침 시 토큰 유지) */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedEmail = localStorage.getItem("userEmail");
    if (token) {
      fetchFavorites();
      setUser({ email: savedEmail || "사용자" }); // ✅ 저장된 이메일 복원
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        favorites,
        login,
        signup,
        logout,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* 커스텀 훅 */
export const useAuth = () => useContext(AuthContext);
