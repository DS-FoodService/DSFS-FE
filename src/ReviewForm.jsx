import { useState } from 'react';
import { createReview } from './api/reviews';
import { useAuth } from './AuthContext.jsx';

export default function ReviewForm({ restaurantId, onCreated }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, showLoginModal } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.'); 
      showLoginModal();
      return;
    }
    setLoading(true);
    try {
      await createReview(restaurantId, { rating, content });
      setContent('');
      onCreated?.(); // 부모가 목록 재요청하도록
    } catch (e) {
      console.error(e);
      alert('리뷰 등록 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 p-3 border rounded">
      <label className="text-sm font-semibold">
        평점
        <select
          className="ml-2 border rounded px-2 py-1"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <textarea
        className="border rounded p-2"
        placeholder="리뷰 내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
      />
      <button
        type="submit"
        disabled={loading}
        className="self-end px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700 disabled:opacity-50"
      >
        {loading ? '등록 중...' : '리뷰 등록'}
      </button>
    </form>
  );
}
