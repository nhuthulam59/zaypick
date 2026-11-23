import type { Metadata } from 'next';

// Shop is a client component, so its SEO metadata lives in this layout.
export const metadata: Metadata = {
  title: 'Shop All Products — ZayPick',
  description: 'Shop all hand-picked Amazon deals on ZayPick — Electronics, Fashion, Home, Beauty & Sports, with prices, ratings and discounts.',
  alternates: { canonical: 'https://zaypick.vercel.app/shop' },
  openGraph: {
    title: 'Shop All Products — ZayPick',
    description: 'Shop all hand-picked Amazon deals on ZayPick — Electronics, Fashion, Home, Beauty & Sports, with prices, ratings and discounts.',
    url: 'https://zaypick.vercel.app/shop',
    siteName: 'ZayPick',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/brand/zaypick-banner.webp', width: 2736, height: 912, alt: 'ZayPick — Smart Shopping, Best Deals, Every Day' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products — ZayPick',
    description: 'Shop all hand-picked Amazon deals on ZayPick — Electronics, Fashion, Home, Beauty & Sports, with prices, ratings and discounts.',
    images: ['/brand/zaypick-banner.webp'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
