import Link from 'next/link';
import { readDb } from '@/lib/db';

export default function Header() {
  const db = readDb();
  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-md">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-4">
        <Link href="/" className="order-1 shrink-0 text-xl font-black tracking-tight sm:text-2xl">
          {db.settings.siteName}<span className="text-brand">.</span>
        </Link>
        <form action="/shop" method="get" className="order-4 flex w-full min-w-0 items-center overflow-hidden rounded-full bg-white shadow-inner md:order-2 md:mx-2 md:w-auto md:max-w-xl md:flex-1">
          <input name="q" placeholder="Search products, brands..." className="w-full px-4 py-1.5 text-sm text-slate-800 outline-none" />
          <button type="submit" className="shrink-0 bg-brand px-4 py-1.5 text-sm font-bold text-white transition hover:bg-brand-dark">Search</button>
        </form>
        <div className="group relative order-2 shrink-0 md:order-3">
          <button className="rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-bold transition group-hover:bg-brand group-hover:text-white">All Departments ▾</button>
          <div className="invisible absolute left-0 top-full z-50 w-48 translate-y-1 rounded-2xl bg-white py-2 text-sm font-semibold text-navy opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            {db.categories.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="block px-4 py-2 transition hover:bg-blue-50 hover:text-brand">{c.name}</Link>
            ))}
            <Link href="/shop?badge=deal" className="block border-t px-4 py-2 font-bold text-red-600 transition hover:bg-red-50">🔥 Today&apos;s Deals</Link>
          </div>
        </div>
        <nav className="order-3 ml-auto flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto text-[13px] font-semibold md:order-4 md:ml-0 md:overflow-visible">
          <Link href="/" className="whitespace-nowrap rounded-full px-3 py-1.5 transition hover:bg-brand hover:text-white">Home</Link>
          <Link href="/shop" className="rounded-full px-3 py-1.5 transition hover:bg-brand hover:text-white">Shop</Link>
          <Link href="/guides" className="rounded-full px-3 py-1.5 transition hover:bg-brand hover:text-white">Buying Guides</Link>
          <Link href="/about" className="rounded-full px-3 py-1.5 transition hover:bg-brand hover:text-white">About</Link>
          <Link href="/admin" className="rounded-full bg-white/15 px-3 py-1.5 transition hover:bg-brand hover:text-white">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
