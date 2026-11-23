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
    // Fallback share image (see app/layout.tsx): the brand banner webp is
    // not in the GitHub repo, so this hero photo is used instead.
    images: [{ url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80', alt: 'ZayPick — Hand-picked Amazon deals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products — ZayPick',
    description: 'Shop all hand-picked Amazon deals on ZayPick — Electronics, Fashion, Home, Beauty & Sports, with prices, ratings and discounts.',
    images: ['https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
