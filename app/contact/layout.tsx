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
    // Fallback share image (see app/layout.tsx): the brand banner webp is
    // not in the GitHub repo, so this hero photo is used instead.
    images: [{ url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80', alt: 'ZayPick — Hand-picked Amazon deals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — ZayPick',
    description: 'Have a question about a product, a deal, or a product you would like us to feature? Send ZayPick a message.',
    images: ['https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
