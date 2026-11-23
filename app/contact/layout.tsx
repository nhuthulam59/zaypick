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
    images: [{ url: '/brand/zaypick-banner.webp', width: 2736, height: 912, alt: 'ZayPick — Smart Shopping, Best Deals, Every Day' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — ZayPick',
    description: 'Have a question about a product, a deal, or a product you would like us to feature? Send ZayPick a message.',
    images: ['/brand/zaypick-banner.webp'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
