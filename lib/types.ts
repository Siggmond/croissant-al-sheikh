export type Currency = 'LBP' | 'USD';

export type MenuCategory = {
  id: string;
  name: string;
  nameAr?: string;
  order: number;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  nameAr?: string;
  description: string;
  price: number;
  currency: Currency;
  badge?: string;
  image?: string;
  available: boolean;
  highlighted?: boolean;
  allergens?: string[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  age: string;
  text: string;
  food?: number;
  service?: number;
  atmosphere?: number;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapsUrl?: string;
  openingHours: string;
};

export type BoardSettings = {
  headline: string;
  subheadline: string;
  ticker: string;
  refreshSeconds: number;
  showQr: boolean;
  theme: 'classic' | 'dark' | 'cream';
};

export type SiteContent = {
  version: number;
  updatedAt: string;
  brand: {
    name: string;
    nameAr: string;
    tagline: string;
    since: string;
    instagram: string;
    phonePrimary: string;
    phoneSecondary?: string;
  };
  priceNotice: string;
  priceSources: Array<{ label: string; note: string; url?: string }>;
  categories: MenuCategory[];
  menu: MenuItem[];
  reviews: Review[];
  branches: Branch[];
  board: BoardSettings;
  gallery: string[];
};

export type ApiResult<T> =
  | { ok: true; data: T; source?: string }
  | { ok: false; error: string; details?: unknown };
