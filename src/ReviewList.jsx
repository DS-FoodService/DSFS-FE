import { useEffect, useState } from 'react';
import { fetchReviews } from './api/reviews';

export default function ReviewList({ restaurantId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchReviews(restaurantId)
      .then((list) => mounted && setItems(list))
      .catch(console.error);
    return () => { mounted = false; };
  }, [restaurantId]);

  if (!items.length) return <p className="text-gray-500">아직 리뷰가 없어요.</p>;

  return (
    <ul className="space-y-3">
      {items.map((rv) => (
        <li key={rv.id} className="p-3 border rounded">
          <div className="text-yellow-500 font-semibold">★ {rv.rating}</div>
          <div className="text-sm">{rv.content}</div>
          <div className="text-xs text-gray-400">{rv.createdAt}</div>
        </li>
      ))}
    </ul>
  );
}
