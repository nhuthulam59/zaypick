import Link from 'next/link';
import Image from 'next/image';
import { readDb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';

export const dynamic = 'force-dynamic';

export default function Home() {
  const db = readDb();
  const deals = [...db.products].sort((a, b) => (b.oldPrice - b.price) - (a.oldPrice - a.price)).slice(0, 8);
  const maxOff = deals.length ? Math.max(...db.products.map((p) => (p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0))) : 0;
  return (
    <div className="space-y-12 py-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-navy to-navy-light text-white">
        <div className="flex flex-col items-start gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between lg:p-12">
          <div>
            <span className="rounded-full bg-brand px-3 py-1 text-sm font-bold">{maxOff > 0 ? `Up to ${maxOff}% Off` : db.settings.heroBadge}</span>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{db.settings.heroTitle}</h1>
            <p className="mt-2 max-w-lg text-base text-blue-100 sm:text-lg">{db.settings.heroSubtitle}</p>
            <Link href="/shop" className="mt-6 inline-block w-full rounded-full bg-brand px-7 py-3 text-center font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark sm:w-auto">Shop Best Deals →</Link>
          </div>
          <div className="relative h-44 w-full overflow-hidden rounded-2xl sm:h-48 md:h-56 md:max-w-sm">
            <Image src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80" alt="Seasonal savings" fill priority className="object-cover" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">✦ Find your favourite</p>
            <h2 className="mt-1 text-2xl font-black text-navy sm:text-3xl">Shop by Category</h2>
            <p className="mt-1 text-sm text-slate-500">Five worlds, one place — tap a category and jump straight to its best Amazon deals.</p>
          </div>
          <Link href="/shop" className="rounded-full bg-navy px-5 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-navy-light">View all →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {db.categories.map((c) => {
            const items = db.products.filter((p) => p.category === c.slug);
            const from = items.length ? Math.min(...items.map((p) => p.price)) : 0;
            const bestOff = items.length ? Math.max(...items.map((p) => Math.round((1 - p.price / p.oldPrice) * 100))) : 0;
            const style: Record<string, { icon: string; grad: string; chip: string }> = {
              electronics: { icon: '🎧', grad: 'from-blue-600/90 via-navy/70 to-transparent', chip: 'bg-blue-600' },
              fashion: { icon: '👗', grad: 'from-pink-600/90 via-purple-700/70 to-transparent', chip: 'bg-pink-600' },
              home: { icon: '🏠', grad: 'from-amber-500/90 via-orange-600/70 to-transparent', chip: 'bg-amber-500' },
              beauty: { icon: '💄', grad: 'from-rose-500/90 via-fuchsia-600/70 to-transparent', chip: 'bg-rose-500' },
              sports: { icon: '🏃', grad: 'from-emerald-500/90 via-teal-600/70 to-transparent', chip: 'bg-emerald-500' },
            };
            const s = style[c.slug] || { icon: '🛍️', grad: 'from-navy/90 via-navy/70 to-transparent', chip: 'bg-navy' };
            return (
              <Link key={c.id} href={`/category/${c.slug}`} className="group relative overflow-hidden rounded-3xl shadow-md ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-brand/40">
                <div className="relative h-44 overflow-hidden sm:h-52 lg:h-56">
                  <Image src={c.image} alt={c.name} fill className="object-cover transition duration-500 group-hover:scale-110 group-hover:rotate-1" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${s.grad}`} />
                  {bestOff > 0 && <span className="absolute right-2 top-2 rounded-full bg-brand px-2 py-1 text-[11px] font-black text-white shadow-lg sm:right-3 sm:top-3 sm:px-3 sm:text-xs">Up to {bestOff}% OFF</span>}
                  <span className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-xl shadow-lg transition group-hover:scale-110 group-hover:-rotate-6 sm:left-3 sm:top-3 sm:h-11 sm:w-11 sm:rounded-2xl sm:text-2xl">{s.icon}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-lg font-black drop-shadow sm:text-xl">{c.name}</p>
                  <p className="mt-0.5 hidden line-clamp-2 text-xs leading-snug text-white/90 sm:block">{c.description}</p>
                  <p className="mt-2 text-xs font-bold text-white/90">{items.length} products{from > 0 ? ` · From $${from.toFixed(2)}` : ''}</p>
                  <span className={`mt-3 inline-flex items-center gap-1 rounded-full ${s.chip} px-3 py-1.5 text-xs font-black text-white shadow transition group-hover:gap-2 sm:px-4`}>Shop now →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-black text-navy sm:text-2xl">Best Deals — Today&apos;s Top Picks</h2>
        <p className="text-sm text-slate-500">Hand-picked Amazon deals, updated by the ZayPick team. Prices as shown on each product.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {deals.map((p) => <ProductCard key={p.id} product={p} tag={db.settings.amazonTag} />)}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['🚚', 'Fast Amazon Delivery', 'Prime-eligible items, fast shipping'],
          ['🛡️', 'Trusted Picks', 'Only well-reviewed products'],
          ['💰', 'Real Discounts', 'Price vs old price shown clearly'],
          ['↩️', "Amazon Returns", "Amazon's return policy applies"],
        ].map(([icon, title, text]) => (
          <div key={title} className="rounded-2xl border p-5 text-center transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-3xl">{icon}</p><p className="mt-2 font-bold">{title}</p><p className="text-sm text-slate-500">{text}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-end justify-between"><h2 className="text-xl font-black text-navy sm:text-2xl">Buying Guides</h2><Link href="/guides" className="text-sm font-bold text-brand">All guides →</Link></div>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {db.guides.map((g) => (
            <Link key={g.id} href={`/guides/${g.slug}`} className="group overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-40 overflow-hidden"><Image src={g.image} alt={g.title} fill className="object-cover transition group-hover:scale-105" /></div>
              <div className="p-4"><p className="text-xs font-bold uppercase text-brand">{g.category}</p><h3 className="mt-1 font-bold group-hover:text-blue-700">{g.title}</h3><p className="mt-1 text-sm text-slate-500">{g.excerpt}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
      <p className="text-center text-xs text-slate-400">As an Amazon Associate I earn from qualifying purchases.</p>
    </div>
  );
}
