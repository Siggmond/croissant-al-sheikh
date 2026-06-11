import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'),
  title: 'Center Croissant Al Sheikh | Digital Menu Board',
  description: 'A production-ready website and Vercel-powered digital menu board for Center Croissant Al Sheikh.',
  openGraph: {
    title: 'Center Croissant Al Sheikh',
    description: 'Fresh hot croissants, menu, reviews, branches, and live digital menu board.',
    images: ['/media/fresh-stack.webp']
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e66b1d'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
