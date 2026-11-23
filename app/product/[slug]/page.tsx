import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';
import ProductCard, { Stars } from '@/components/ProductCard';
import BuyButton from '@/components/BuyButton';
import { amazonLink, discountPct } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const db = readDb();
  const product = db.products.find((p) => p.slug === params.slug);
  if (!product) return { title: 'Product — ZayPick' };
  return { title: `${product.name} — ZayPick`, description: `${product.name} — $${product.price.toFixed(2)} on Amazon (was $${product.oldPrice.toFixed(2)}). ${product.description.slice(0, 120)}` };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const db = readDb();
  const product = db.products.find((p) => p.slug === params.slug);
  if (!product) notFound();
  const related = db.products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const pct = discountPct(product);
  return (
    <div className="py-6">
      <p className="truncate text-sm text-slate-500"><Link href="/" className="hover:text-brand">Home</Link> / <Link href="/shop" className="hover:text-brand">Shop</Link> / {product.name}</p>
      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:gap-8">
        <div className="relative h-72 overflow-hidden rounded-3xl bg-slate-100 sm:h-96">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
          {pct > 0 && <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">-{pct}%</span>}
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-navy/70">{product.category}</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{product.name}</h1>
          <p className="mt-2"><Stars rating={product.rating} /> <span className="text-slate-500">{product.rating} · {product.reviews.toLocaleString()} reviews</span></p>
          <p className="mt-4"><span className="text-3xl font-black">${product.price.toFixed(2)}</span>{product.oldPrice > product.price && <span className="ml-3 text-lg text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>}</p>
          <p className="text-sm text-slate-400">Price as of {product.priceAsOf} — check current price on Amazon</p>
          <p className="mt-2 text-xs text-slate-500">As an Amazon Associate I earn from qualifying purchases.</p>
          <BuyButton productId={product.id} href={amazonLink(product.amazonUrl, db.settings.amazonTag)} className="mt-5 block rounded-full bg-brand px-6 py-3.5 text-center text-lg font-bold text-white transition hover:bg-brand-dark" />
          <p className="mt-2 text-sm text-slate-500">ASIN: <span className="font-mono">{product.asin}</span> · Sold and shipped by Amazon (see Amazon page for details).</p>
          <h2 className="mt-6 font-bold">Highlights</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">{product.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-6"><h2 className="text-xl font-bold">About this product</h2><p className="mt-2 text-slate-600">{product.description}</p>
          <h3 className="mt-4 font-bold text-green-700">Pros</h3><ul className="mt-1 list-disc pl-5 text-slate-600">{product.pros.map((x) => <li key={x}>{x}</li>)}</ul>
          <h3 className="mt-4 font-bold text-red-700">Cons</h3><ul className="mt-1 list-disc pl-5 text-slate-600">{product.cons.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="rounded-2xl border p-6"><h2 className="text-xl font-bold">Why buy through ZayPick?</h2><p className="mt-2 text-slate-600">We hand-pick well-reviewed products and show the discount clearly. You buy directly on Amazon — same price, same Amazon returns and customer service. We earn a small commission at no extra cost to you.</p></div>
      </div>
      {related.length > 0 && (<section className="mt-10"><h2 className="text-2xl font-black text-navy">Related products</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} tag={db.settings.amazonTag} />)}</div></section>)}
    </div>
  );
}
