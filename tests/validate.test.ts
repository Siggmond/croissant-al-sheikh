import { describe, expect, it } from 'vitest';
import { seedContent } from '../data/seed';
import { validateContent } from '../lib/validate';

describe('content validation', () => {
  it('accepts the seed data', () => {
    expect(validateContent(seedContent).brand.name).toBe('Center Croissant Al Sheikh');
  });

  it('rejects bad menu category references', () => {
    const broken = structuredClone(seedContent);
    broken.menu[0].categoryId = 'missing';
    expect(() => validateContent(broken)).toThrow(/unknown category/);
  });
});
