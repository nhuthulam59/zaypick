import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VisitTracker from '@/components/VisitTracker';
import { readDb } from '@/lib/db';

export const viewport = { width: 'device-width', initialScale: 1 };

// Share image: the real brand banner, uploaded to public/zaypick-banner.webp
// (public/ root, not public/brand/). metadataBase resolves the relative
// path to https://zaypick.vercel.app/zaypick-banner.webp.
const OG_IMAGE = '/zaypick-banner.webp';

export const metadata: Metadata = {
  metadataBase: new URL('https://zaypick.vercel.app'),
  title: 'ZayPick — Hand-picked Amazon Deals',
  description: 'ZayPick finds the best Amazon deals across Electronics, Fashion, Home, Beauty & Sports. As an Amazon Associate I earn from qualifying purchases.',
  openGraph: {
    title: 'ZayPick — Hand-picked Amazon Deals',
    description: 'ZayPick finds the best Amazon deals across Electronics, Fashion, Home, Beauty & Sports. As an Amazon Associate I earn from qualifying purchases.',
    url: 'https://zaypick.vercel.app',
    siteName: 'ZayPick',
    type: 'website',
    locale: 'en_US',
    images: [{ url: OG_IMAGE, alt: 'ZayPick — Hand-picked Amazon deals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZayPick — Hand-picked Amazon Deals',
    description: 'ZayPick finds the best Amazon deals across Electronics, Fashion, Home, Beauty & Sports. As an Amazon Associate I earn from qualifying purchases.',
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const db = readDb();
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager — GTM-W54DK96R */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W54DK96R');`,
          }}
        />
        {/* Google Analytics 4 — G-HGHB9RDP9N (direct tag; do not also add a GA4 tag in GTM, or visits will count twice) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HGHB9RDP9N"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-HGHB9RDP9N');`,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W54DK96R"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <VisitTracker />
        <Header />
        <main className="mx-auto min-h-[60vh] w-full max-w-7xl px-3 sm:px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
