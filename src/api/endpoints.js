export const AUTH_LOGIN   = '/auth/login';
export const AUTH_SIGNUP  = '/auth/signup';      // swagger에서 sign-up이면 이 값만 바꾸세요
export const AUTH_ME      = '/auth/me';

export const FAV_LIST     = '/favorites';
export const FAV_TOGGLE   = '/favorites/toggle';

export const REVIEWS_LIST = (restaurantId) => `/restaurants/${restaurantId}/reviews`;
export const REVIEWS_POST = (restaurantId) => `/restaurants/${restaurantId}/reviews`;
