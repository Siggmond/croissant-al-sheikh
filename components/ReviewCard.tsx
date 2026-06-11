import type { Review } from '@/lib/types';
import { ratingStars } from '@/lib/format';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review">
      <div className="stars" aria-label={`${review.rating} out of 5 stars`}>{ratingStars(review.rating)}</div>
      <strong>{review.author}</strong> <small>• {review.age}</small>
      <p>{review.text}</p>
      {(review.food || review.service || review.atmosphere) ? (
        <small>
          {review.food ? `Food: ${review.food} ` : ''}
          {review.service ? `Service: ${review.service} ` : ''}
          {review.atmosphere ? `Atmosphere: ${review.atmosphere}` : ''}
        </small>
      ) : null}
    </article>
  );
}
