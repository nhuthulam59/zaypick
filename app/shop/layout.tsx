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
    // Share image: the real brand banner at /zaypick-banner.webp (see app/layout.tsx).
    images: [{ url: '/zaypick-banner.webp', alt: 'ZayPick — Hand-picked Amazon deals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products — ZayPick',
    description: 'Shop all hand-picked Amazon deals on ZayPick — Electronics, Fashion, Home, Beauty & Sports, with prices, ratings and discounts.',
    images: ['/zaypick-banner.webp'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
