import { Hind_Siliguri } from 'next/font/google';

// Bengali-first typography for the whole admin panel (login + dashboard).
// Hind Siliguri renders Bengali beautifully; Noto Sans Bengali is the fallback.
const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${hindSiliguri.className} min-h-screen`}>{children}</div>;
}
