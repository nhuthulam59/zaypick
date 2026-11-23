'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { discountPct } from '@/lib/types';

export function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return <span className="text-amber-400" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}</span>;
}

export default function ProductCard({ product, tag }: { product: Product; tag: string }) {
  const pct = discountPct(product);
  const amazonUrl = product.amazonUrl.includes('tag=')
    ? product.amazonUrl
    : `${product.amazonUrl}${product.amazonUrl.includes('?') ? '&' : '?'}tag=${encodeURIComponent(tag)}`;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {pct > 0 && <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">-{pct}%</span>}
      {product.badge && <span className="absolute right-3 top-3 z-10 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">{product.badge}</span>}
      <Link href={`/product/${product.slug}`} className="relative block h-36 overflow-hidden bg-slate-200 sm:h-44 lg:h-52">
        <Image src={product.image} alt={product.name} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy/70">{product.category}</p>
        <Link href={`/product/${product.slug}`} className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition group-hover:text-blue-700 sm:text-base">{product.name}</Link>
        <p className="mt-1 text-sm"><Stars rating={product.rating} /> <span className="text-slate-500">{product.rating} ({product.reviews.toLocaleString()})</span></p>
        <p className="mt-2">
          <span className="text-lg font-black text-slate-900 sm:text-xl">${product.price.toFixed(2)}</span>
          {product.oldPrice > product.price && <span className="ml-2 text-sm text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>}
        </p>
        <p className="text-xs text-slate-400">Price as of {product.priceAsOf} — check current price on Amazon</p>
        <a href={amazonUrl} target="_blank" rel="sponsored nofollow noopener" onClick={() => { try { const visitorId = sessionStorage.getItem('zaypick_vid') || ''; fetch('/api/clicks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: product.id, visitorId }) }).catch(() => {}); } catch {} }} className="mt-3 rounded-full bg-brand px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-brand-dark sm:py-2.5">
          Buy on Amazon →
        </a>
      </div>
    </article>
  );
}
