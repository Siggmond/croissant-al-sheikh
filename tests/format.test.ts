import { describe, expect, it } from 'vitest';
import { formatMoney, ratingStars, slugify } from '../lib/format';

describe('format helpers', () => {
  it('formats LBP prices', () => {
    expect(formatMoney(70000, 'LBP')).toBe('70,000 LBP');
  });

  it('returns ask branch for zero price', () => {
    expect(formatMoney(0, 'LBP')).toBe('Ask branch');
  });

  it('formats rating stars', () => {
    expect(ratingStars(4)).toBe('★★★★☆');
  });

  it('slugifies names', () => {
    expect(slugify('Chocolate Croissant!')).toBe('chocolate-croissant');
  });
});
