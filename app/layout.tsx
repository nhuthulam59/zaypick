import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { readDb } from '@/lib/db';

export const viewport = { width: 'device-width', initialScale: 1 };
export const metadata: Metadata = {
  title: 'ZayPick — Hand-picked Amazon Deals',
  description: 'ZayPick finds the best Amazon deals across Electronics, Fashion, Home, Beauty & Sports. As an Amazon Associate I earn from qualifying purchases.',
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
        <Header />
        <main className="mx-auto min-h-[60vh] w-full max-w-7xl px-3 sm:px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
