// AUTH
export const AUTH_SIGNUP = "/auth/signup";
export const AUTH_LOGIN = "/auth/login";

// BOOKMARK (찜)
export const FAV_TOGGLE = "/api/bookmark";
export const FAV_LIST = "/api/bookmark";

// RESTAURANT
export const RESTAURANT_LIST = "/restaurants"; // (식당 목록)
export const RESTAURANT_DETAIL = (id) => "/restaurants/${id}";

// REVIEW
// GET /review/{restaurantId}
export const REVIEWS_LIST = "/reviews";       
// POST /review/write
export const REVIEW_CREATE = "/reviews";
