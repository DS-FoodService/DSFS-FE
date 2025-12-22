// AUTH
export const AUTH_SIGNUP = "/auth/signup";
export const AUTH_LOGIN = "/auth/login";

// BOOKMARK (찜) - 백엔드가 /api/bookmark를 기대함
// 프록시가 /api를 제거하므로, /api/api/bookmark로 요청해야 api.babsang.shop/api/bookmark가 됨
export const FAV_TOGGLE = "/api/bookmark";
export const FAV_LIST = "/api/bookmark";

// RESTAURANT
export const RESTAURANT_LIST = "/restaurants";
export const RESTAURANT_DETAIL = (id) => `/restaurants/${id}`;

// REVIEW
export const REVIEWS_LIST = "/reviews";
export const REVIEW_CREATE = "/reviews";
