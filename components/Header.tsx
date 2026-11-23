import Link from 'next/link';
import { readDb } from '@/lib/db';

export default function Header() {
  const db = readDb();
  return (
    <header className="sticky top-0 z-40 shadow-md">
      <div className="bg-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link href="/" className="text-2xl font-black tracking-tight">
            {db.settings.siteName}<span className="text-brand">.</span>
          </Link>
          <form action="/shop" method="get" className="flex min-w-[200px] flex-1 items-center overflow-hidden rounded-full bg-white">
            <input name="q" placeholder="Search for products, brands and more..." className="w-full px-4 py-2 text-sm text-slate-800 outline-none" />
            <button type="submit" className="bg-brand px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-dark">Search</button>
          </form>
          <nav className="hidden items-center gap-4 text-sm font-semibold md:flex">
            <Link href="/" className="hover:text-orange-300">Home</Link>
            <Link href="/shop" className="hover:text-orange-300">Shop</Link>
            <Link href="/guides" className="hover:text-orange-300">Buying Guides</Link>
            <Link href="/about" className="hover:text-orange-300">About</Link>
            <Link href="/admin" className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">Admin</Link>
          </nav>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 text-sm font-medium">
          <span className="font-bold text-navy">All Departments ▾</span>
          {db.categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="text-slate-600 transition hover:text-brand">{c.name}</Link>
          ))}
          <Link href="/shop?badge=deal" className="ml-auto font-bold text-red-600">🔥 Today's Deals</Link>
        </div>
      </div>
    </header>
  );
}
