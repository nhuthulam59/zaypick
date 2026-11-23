import Link from 'next/link';
import { readDb } from '@/lib/db';

export default function Header() {
  const db = readDb();
  return (
    <header className="sticky top-0 z-40 shadow-md">
      <div className="bg-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="shrink-0 text-2xl font-black tracking-tight">
            {db.settings.siteName}<span className="text-brand">.</span>
          </Link>
          <form action="/shop" method="get" className="flex w-full max-w-md flex-1 items-center overflow-hidden rounded-full bg-white shadow-inner">
            <input name="q" placeholder="Search products..." className="w-full px-4 py-2 text-sm text-slate-800 outline-none" />
            <button type="submit" className="shrink-0 bg-brand px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-dark">Search</button>
          </form>
          <Link href="/admin" className="shrink-0 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold transition hover:bg-brand hover:text-white">Admin</Link>
        </div>
      </div>
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-sm font-bold md:gap-4">
          <Link href="/" className="rounded-full px-5 py-2 text-navy transition hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-lg">Home</Link>
          <Link href="/shop" className="rounded-full px-5 py-2 text-navy transition hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-lg">Shop</Link>
          <Link href="/guides" className="rounded-full px-5 py-2 text-navy transition hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-lg">Buying Guides</Link>
          <Link href="/about" className="rounded-full px-5 py-2 text-navy transition hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-lg">About</Link>
        </div>
      </nav>
      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 text-sm font-medium">
          <span className="font-bold text-navy">All Departments ▾</span>
          {db.categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="rounded-full px-2 py-1 text-slate-600 transition hover:bg-blue-50 hover:text-brand">{c.name}</Link>
          ))}
          <Link href="/shop?badge=deal" className="ml-auto font-bold text-red-600">🔥 Today's Deals</Link>
        </div>
      </div>
    </header>
  );
}
