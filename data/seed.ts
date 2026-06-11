import type { SiteContent } from '@/lib/types';

export const seedContent: SiteContent = {
  version: 1,
  updatedAt: '2026-06-12T00:00:00.000Z',
  brand: {
    name: 'Center Croissant Al Sheikh',
    nameAr: 'كروسان الشيخ',
    tagline: 'Hot, flaky, and made for take-away since 2004.',
    since: '2004',
    instagram: 'centercroissantalsheikh.lb',
    phonePrimary: '05 814 454',
    phoneSecondary: '81 899 393'
  },
  priceNotice:
    'Prices are editable from the admin panel. Public sources for Al Sheikh/Croissant Al Sheikh are limited, so confirm branch prices before accepting live orders.',
  priceSources: [
    {
      label: 'Google review, Dec 2021',
      note: 'A reviewer mentioned 10,000 LBP for a croissant in December 2021; this is historical and not suitable as a current price.'
    },
    {
      label: 'Public Beirut.com reference',
      note: 'A public Beirut.com food post referenced basic croissants at 70,000 LBP, special flavors at 140,000 LBP, and a giant croissant at 900,000 LBP for an Al Sheikh/Crazy Croissant listing. Treat as a reference until owner confirms.'
    }
  ],
  categories: [
    { id: 'classic', name: 'Classic Croissants', nameAr: 'الكلاسيك', order: 1 },
    { id: 'sweet', name: 'Sweet Favorites', nameAr: 'الحلو', order: 2 },
    { id: 'family', name: 'Family & Boxes', nameAr: 'العائلي', order: 3 },
    { id: 'spreads', name: 'Spreads', nameAr: 'كريمات', order: 4 }
  ],
  menu: [
    {
      id: 'zaatar',
      categoryId: 'classic',
      name: 'Zaatar Croissant',
      nameAr: 'كرواسان زعتر',
      description: 'A hot flaky croissant filled with thyme mix. Best eaten straight from the oven.',
      price: 70000,
      currency: 'LBP',
      badge: 'Most loved',
      image: '/media/classic-croissant.webp',
      available: true,
      highlighted: true,
      allergens: ['gluten', 'dairy', 'sesame']
    },
    {
      id: 'cheese',
      categoryId: 'classic',
      name: 'Cheese Croissant',
      nameAr: 'كرواسان جبنة',
      description: 'Warm cheese croissant with a light buttery crust.',
      price: 70000,
      currency: 'LBP',
      image: '/media/sesame-croissant.webp',
      available: true,
      allergens: ['gluten', 'dairy']
    },
    {
      id: 'chocolate',
      categoryId: 'sweet',
      name: 'Chocolate Croissant',
      nameAr: 'كرواسان شوكولا',
      description: 'Classic sweet croissant with chocolate filling.',
      price: 70000,
      currency: 'LBP',
      badge: 'Hot seller',
      image: '/media/chocolate-drizzle.webp',
      available: true,
      highlighted: true,
      allergens: ['gluten', 'dairy']
    },
    {
      id: 'lotus',
      categoryId: 'sweet',
      name: 'Lotus Croissant',
      nameAr: 'كرواسان لوتس',
      description: 'Special flavor croissant with creamy biscuit spread.',
      price: 140000,
      currency: 'LBP',
      badge: 'Special',
      image: '/media/crunch-croissant.webp',
      available: true,
      allergens: ['gluten', 'dairy']
    },
    {
      id: 'nutella',
      categoryId: 'sweet',
      name: 'Nutella Croissant',
      nameAr: 'كرواسان نوتيلا',
      description: 'Rich hazelnut chocolate spread inside a flaky croissant.',
      price: 140000,
      currency: 'LBP',
      badge: 'Special',
      image: '/media/plate-chocolate.webp',
      available: true,
      allergens: ['gluten', 'dairy', 'hazelnut']
    },
    {
      id: 'kinder',
      categoryId: 'sweet',
      name: 'Kinder Croissant',
      nameAr: 'كرواسان كيندر',
      description: 'Creamy special croissant for chocolate lovers.',
      price: 140000,
      currency: 'LBP',
      badge: 'Special',
      image: '/media/drizzle-croissant.webp',
      available: true,
      allergens: ['gluten', 'dairy']
    },
    {
      id: 'mini-box',
      categoryId: 'family',
      name: 'Mini Croissant Box',
      nameAr: 'علبة ميني كرواسان',
      description: 'Assorted mini croissants for office, home, and events. Update quantity/prices by branch.',
      price: 0,
      currency: 'LBP',
      badge: 'Ask branch',
      image: '/media/mini-croissants.webp',
      available: true,
      allergens: ['gluten', 'dairy']
    },
    {
      id: 'giant',
      categoryId: 'family',
      name: 'Giant Croissant',
      nameAr: 'كرواسان عملاق',
      description: 'Large shareable croissant for gatherings and content-worthy orders.',
      price: 900000,
      currency: 'LBP',
      badge: 'Pre-order',
      image: '/media/basket-croissants.webp',
      available: true,
      highlighted: true,
      allergens: ['gluten', 'dairy']
    },
    {
      id: 'hola-chocolate',
      categoryId: 'spreads',
      name: 'Hola Chocolate Spread',
      nameAr: 'هولا شوكولا',
      description: 'Retail jar promoted by the brand. Price by size and branch.',
      price: 0,
      currency: 'LBP',
      badge: 'Retail',
      image: '/media/chocolate-cup.webp',
      available: true,
      allergens: ['dairy', 'hazelnut']
    }
  ],
  reviews: [
    {
      id: 'kamal-kabalan',
      author: 'Kamal Kabalan',
      rating: 4,
      age: '2 years ago',
      text: 'The croissant is small but so good, especially hot. Zaatar is great, cheese is minimal but tasty, and chocolate is always great. Best for grabbing to go; no seating available.',
      food: 5,
      service: 4,
      atmosphere: 4
    },
    {
      id: 'rafael',
      author: 'Rafael',
      rating: 3,
      age: '4 years ago',
      text: 'Hot and fresh straight out of the oven. Zaatar was the best for me. Once they cool down, they are less tasty, so eat them hot.'
    },
    {
      id: 'ze7dd',
      author: 'ZE7DD',
      rating: 5,
      age: '7 years ago',
      text: 'The taste was amazing and reminded me of great croissant back home. Thumbs up!'
    },
    {
      id: 'aa',
      author: 'A A',
      rating: 5,
      age: '8 years ago',
      text: 'Very good. Loved it. Lots of croissant choices. Cheese and chocolate croissants were excellent.'
    },
    {
      id: 'sam-za',
      author: 'Sam Za',
      rating: 5,
      age: '4 years ago',
      text: 'Top of the top. Love it.'
    },
    {
      id: 'ali-rammal',
      author: 'Ali Rammal',
      rating: 1,
      age: '1 month ago',
      text: 'Recent negative feedback exists, so quality consistency should be monitored and the site should not hide criticism internally.'
    }
  ],
  branches: [
    {
      id: 'bchamoun',
      name: 'Bchamoun Branch',
      address: 'Bchamoun, Lebanon',
      phone: '05 814 454',
      openingHours: 'Daily morning to late evening'
    },
    {
      id: 'aramoun',
      name: 'Aramoun Branch',
      address: 'Aramoun, Lebanon',
      phone: '03 858 538',
      openingHours: 'Daily morning to late evening'
    },
    {
      id: 'hamra',
      name: 'Hamra Reference Location',
      address: 'Hamra, Beirut, Lebanon',
      phone: '01 342 323',
      openingHours: 'Confirm before visiting'
    }
  ],
  board: {
    headline: 'Fresh croissants are coming out hot now',
    subheadline: 'Zaatar • Cheese • Chocolate • Special flavors',
    ticker: 'Best enjoyed hot. Ask for today\'s fresh batch and family boxes.',
    refreshSeconds: 15,
    showQr: true,
    theme: 'dark'
  },
  gallery: [
    '/media/fresh-stack.webp',
    '/media/hand-croissant.webp',
    '/media/breakfast-croissants.webp',
    '/media/juice-croissant.webp',
    '/media/mixed-plate.webp',
    '/media/wooden-board.webp',
    '/media/tray-croissants.webp',
    '/media/baked-selection.webp',
    '/media/golden-croissant.webp',
    '/media/sunrise-croissant.webp',
    '/media/world-cup.webp'
  ]
};
