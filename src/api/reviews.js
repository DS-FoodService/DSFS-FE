import api from './client';
import { REVIEWS_LIST, REVIEWS_POST } from './endpoints';

export async function fetchReviews(restaurantId) {
  const { data } = await api.get(REVIEWS_LIST(restaurantId));
  // swagger가 payload를 배열로 줄 수도 있고, {content: [], total: ...}일 수도 있음
  return Array.isArray(data) ? data : (data?.content || []);
}

export async function createReview(restaurantId, payload) {
  // payload 예: { rating: 4, content: '맛있어요!' }
  const { data } = await api.post(REVIEWS_POST(restaurantId), payload);
  return data;
}
