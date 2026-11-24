import { Noto_Serif_Bengali } from 'next/font/google';

// Bengali-first typography for the whole admin panel (login + dashboard).
// Noto Serif Bengali renders Bengali beautifully; Noto Sans Bengali is the fallback.
const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${notoSerifBengali.className} min-h-screen`}>{children}</div>;
}
