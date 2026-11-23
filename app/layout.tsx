import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { readDb } from '@/lib/db';

export const metadata: Metadata = {
  title: 'ZayPick — Hand-picked Amazon Deals',
  description: 'ZayPick finds the best Amazon deals across Electronics, Fashion, Home, Beauty & Sports. As an Amazon Associate I earn from qualifying purchases.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const db = readDb();
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto min-h-[60vh] max-w-7xl px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
