import Link from 'next/link';
import Image from 'next/image';
import { readDb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';

export const dynamic = 'force-dynamic';

export default function Home() {
  const db = readDb();
  const deals = [...db.products].sort((a, b) => (b.oldPrice - b.price) - (a.oldPrice - a.price)).slice(0, 8);
  return (
    <div className="space-y-12 py-6">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-navy to-navy-light text-white">
        <div className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <span className="rounded-full bg-brand px-3 py-1 text-sm font-bold">{db.settings.heroBadge}</span>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{db.settings.heroTitle}</h1>
            <p className="mt-2 max-w-lg text-lg text-blue-100">{db.settings.heroSubtitle}</p>
            <Link href="/shop" className="mt-6 inline-block rounded-full bg-brand px-7 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark">Shop Best Deals →</Link>
          </div>
          <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-2xl md:h-56">
            <Image src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80" alt="Seasonal savings" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between"><h2 className="text-2xl font-black text-navy">Shop by Category</h2><Link href="/shop" className="text-sm font-bold text-brand">View all →</Link></div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
          {db.categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="group overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-32 overflow-hidden"><Image src={c.image} alt={c.name} fill className="object-cover transition group-hover:scale-105" /></div>
              <div className="p-3 text-center"><p className="font-bold">{c.name}</p><p className="text-xs text-slate-500">{db.products.filter((p) => p.category === c.slug).length} products</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-navy">Best Deals — Today&apos;s Top Picks</h2>
        <p className="text-sm text-slate-500">Hand-picked Amazon deals, updated by the ZayPick team. Prices as shown on each product.</p>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((p) => <ProductCard key={p.id} product={p} tag={db.settings.amazonTag} />)}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
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
        <div className="flex items-end justify-between"><h2 className="text-2xl font-black text-navy">Buying Guides</h2><Link href="/guides" className="text-sm font-bold text-brand">All guides →</Link></div>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
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
