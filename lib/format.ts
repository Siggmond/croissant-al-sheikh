export function formatMoney(amount: number, currency: 'LBP' | 'USD'): string {
  if (!amount) return 'Ask branch';
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  return `${new Intl.NumberFormat('en-US').format(amount)} LBP`;
}

export function ratingStars(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

export function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
