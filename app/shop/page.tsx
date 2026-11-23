'use client';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

// Data is embedded at build time from data/db.json via a server fetch in the
// parent — here we import the seed JSON directly so filters work client-side.
import db from '@/data/db.json';

function ShopInner() {
  const params = useSearchParams();
  const q = (params.get('q') || '').toLowerCase();
  const [cat, setCat] = useState('');
  const [maxPrice, setMaxPrice] = useState(200);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('featured');

  const products = useMemo(() => {
    let list = (db.products as Product[]).filter((p) => {
      if (cat && p.category !== cat) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (q && !`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'discount') list = [...list].sort((a, b) => (b.oldPrice - b.price) - (a.oldPrice - a.price));
    return list;
  }, [cat, maxPrice, minRating, sort, q]);

  return (
    <div className="py-6">
      <h1 className="text-3xl font-black text-navy">Shop All Products</h1>
      {q && <p className="text-slate-500">Results for “{q}”</p>}
      <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="space-y-5 rounded-2xl border p-5 h-fit">
          <div><p className="font-bold">Department</p>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2">
              <option value="">All Departments</option>
              {(db.categories as { slug: string; name: string }[]).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div><p className="font-bold">Max price: ${maxPrice}</p>
            <input type="range" min={20} max={200} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-orange-500" />
          </div>
          <div><p className="font-bold">Minimum rating</p>
            <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="mt-2 w-full rounded-lg border px-3 py-2">
              <option value={0}>Any rating</option><option value={4}>4★ & up</option><option value={4.5}>4.5★ & up</option>
            </select>
          </div>
          <div><p className="font-bold">Sort by</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2">
              <option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="rating">Top Rated</option><option value="discount">Biggest Discount</option>
            </select>
          </div>
          <button onClick={() => { setCat(''); setMaxPrice(200); setMinRating(0); setSort('featured'); }} className="w-full rounded-full border py-2 text-sm font-bold">Clear filters</button>
        </aside>
        <div>
          <p className="text-sm text-slate-500">{products.length} product(s) found</p>
          {products.length === 0 ? <p className="mt-8 rounded-2xl border p-8 text-center text-slate-500">No products match these filters. Try clearing a filter.</p> : (
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => <ProductCard key={p.id} product={p} tag={(db.settings as { amazonTag: string }).amazonTag} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-slate-500">Loading shop…</p>}>
      <ShopInner />
    </Suspense>
  );
}
