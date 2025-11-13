import api from './client';
import { REVIEWS_LIST, REVIEWS_POST } from './endpoints';

export async function fetchReviews(restaurantId) {
  const { data } = await api.get(REVIEWS_LIST(restaurantId));
  
  return Array.isArray(data) ? data : (data?.content || []);
}

export async function createReview(restaurantId, payload) {
  // payload 예: { rating: 4, content: '맛있어요!' }
  const { data } = await api.post(REVIEWS_POST(restaurantId), payload);
  return data;
}
