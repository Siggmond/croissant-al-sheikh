import type { SiteContent } from '@/lib/types';

export function validateContent(input: unknown): SiteContent {
  if (!input || typeof input !== 'object') throw new Error('Content must be an object');
  const data = input as SiteContent;
  if (!data.brand?.name) throw new Error('Brand name is required');
  if (!Array.isArray(data.categories)) throw new Error('Categories must be an array');
  if (!Array.isArray(data.menu)) throw new Error('Menu must be an array');
  if (!Array.isArray(data.reviews)) throw new Error('Reviews must be an array');
  if (!Array.isArray(data.branches)) throw new Error('Branches must be an array');
  if (!data.board?.headline) throw new Error('Board headline is required');

  const categoryIds = new Set(data.categories.map((category) => category.id));
  for (const item of data.menu) {
    if (!item.id || !item.name) throw new Error('Every menu item needs id and name');
    if (!categoryIds.has(item.categoryId)) throw new Error(`Menu item ${item.name} uses unknown category ${item.categoryId}`);
    if (typeof item.price !== 'number' || item.price < 0) throw new Error(`Invalid price for ${item.name}`);
    if (!['LBP', 'USD'].includes(item.currency)) throw new Error(`Invalid currency for ${item.name}`);
  }

  return {
    ...data,
    version: Number(data.version || 1),
    updatedAt: new Date().toISOString()
  };
}
