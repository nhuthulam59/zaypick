import type { Metadata } from 'next';

// Contact is a client component, so its SEO metadata lives in this layout.
export const metadata: Metadata = {
  title: 'Contact — ZayPick',
  description: 'Have a question about a product, a deal, or a product you would like us to feature? Send ZayPick a message.',
  alternates: { canonical: 'https://zaypick.vercel.app/contact' },
  openGraph: {
    title: 'Contact — ZayPick',
    description: 'Have a question about a product, a deal, or a product you would like us to feature? Send ZayPick a message.',
    url: 'https://zaypick.vercel.app/contact',
    siteName: 'ZayPick',
    type: 'website',
    locale: 'en_US',
    // Share image: the real brand banner at /zaypick-banner.webp (see app/layout.tsx).
    images: [{ url: '/zaypick-banner.webp', alt: 'ZayPick — Hand-picked Amazon deals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — ZayPick',
    description: 'Have a question about a product, a deal, or a product you would like us to feature? Send ZayPick a message.',
    images: ['/zaypick-banner.webp'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
