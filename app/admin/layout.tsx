import { Anek_Bangla } from 'next/font/google';

// Bengali-first typography for the whole admin panel (login + dashboard).
// Anek Bangla renders Bengali cleanly; Noto Sans Bengali is the fallback.
const anekBangla = Anek_Bangla({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${anekBangla.className} min-h-screen`}>{children}</div>;
}
