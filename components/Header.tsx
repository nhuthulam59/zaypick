import Link from 'next/link';
import { readDb } from '@/lib/db';

export default function Header() {
  const db = readDb();
  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="shrink-0 text-2xl font-black tracking-tight">
          {db.settings.siteName}<span className="text-brand">.</span>
        </Link>
        <form action="/shop" method="get" className="mx-2 flex min-w-[220px] max-w-xl flex-1 items-center overflow-hidden rounded-full bg-white shadow-inner">
          <input name="q" placeholder="Search for products, brands and more..." className="w-full px-4 py-1.5 text-sm text-slate-800 outline-none" />
          <button type="submit" className="shrink-0 bg-brand px-4 py-1.5 text-sm font-bold text-white transition hover:bg-brand-dark">Search</button>
        </form>
        <div className="group relative shrink-0">
          <button className="rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-bold transition group-hover:bg-brand group-hover:text-white">All Departments ▾</button>
          <div className="invisible absolute left-0 top-full z-50 w-48 translate-y-1 rounded-2xl bg-white py-2 text-sm font-semibold text-navy opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            {db.categories.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="block px-4 py-2 transition hover:bg-blue-50 hover:text-brand">{c.name}</Link>
            ))}
            <Link href="/shop?badge=deal" className="block border-t px-4 py-2 font-bold text-red-600 transition hover:bg-red-50">🔥 Today&apos;s Deals</Link>
          </div>
        </div>
        <nav className="flex shrink-0 flex-wrap items-center gap-1 text-[13px] font-semibold">
          <Link href="/" className="rounded-full px-3 py-1.5 transition hover:bg-brand hover:text-white">Home</Link>
          <Link href="/shop" className="rounded-full px-3 py-1.5 transition hover:bg-brand hover:text-white">Shop</Link>
          <Link href="/guides" className="rounded-full px-3 py-1.5 transition hover:bg-brand hover:text-white">Buying Guides</Link>
          <Link href="/about" className="rounded-full px-3 py-1.5 transition hover:bg-brand hover:text-white">About</Link>
          <Link href="/admin" className="rounded-full bg-white/15 px-3 py-1.5 transition hover:bg-brand hover:text-white">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
