import Link from 'next/link';
import { readDb } from '@/lib/db';
import MobileMenu from '@/components/MobileMenu';
import SearchBox from '@/components/SearchBox';

export default function Header() {
  const db = readDb();
  const searchProducts = db.products.map((p) => ({ slug: p.slug, name: p.name, category: p.category, price: p.price, oldPrice: p.oldPrice, image: p.image }));
  const searchGuides = db.guides.map((g) => ({ slug: g.slug, title: g.title }));
  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-md">
      {/* Mobile: one row — hamburger, logo, search button. Menu + search open below it. */}
      <MobileMenu siteName={db.settings.siteName} categories={db.categories} products={searchProducts} guides={searchGuides} />

      {/* Desktop: logo, search bar, All Departments, nav — unchanged */}
      <div className="mx-auto hidden w-full max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-4 md:flex">
        <Link href="/" className="order-1 shrink-0 text-xl font-black tracking-tight sm:text-2xl">
          {db.settings.siteName}<span className="text-brand">.</span>
        </Link>
        <SearchBox products={searchProducts} categories={db.categories} guides={searchGuides} inputClassName="px-4 py-1.5" className="order-4 w-full min-w-0 md:order-2 md:mx-2 md:w-auto md:max-w-xl md:flex-1" />
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
