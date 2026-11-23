'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type SearchProduct = { slug: string; name: string; category: string; price: number; oldPrice: number; image: string };
export type SearchCategory = { slug: string; name: string };
export type SearchGuide = { slug: string; title: string };

export default function SearchBox({
  products,
  categories,
  guides,
  autoFocus = false,
  className = '',
  inputClassName = '',
}: {
  products: SearchProduct[];
  categories: SearchCategory[];
  guides: SearchGuide[];
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (query.length < 1) return { products: [] as SearchProduct[], categories: [] as SearchCategory[], guides: [] as SearchGuide[] };
    const words = query.split(/\s+/);
    const match = (text: string) => words.every((w) => text.toLowerCase().includes(w));
    return {
      products: products.filter((p) => match(`${p.name} ${p.category}`)).slice(0, 6),
      categories: categories.filter((c) => match(c.name)).slice(0, 3),
      guides: guides.filter((g) => match(g.title)).slice(0, 2),
    };
  }, [query, products, categories, guides]);

  const total = results.products.length + results.categories.length + results.guides.length;
  const flat: { type: 'product' | 'category' | 'guide'; href: string; label: string }[] = [
    ...results.products.map((p) => ({ type: 'product' as const, href: `/product/${p.slug}`, label: p.name })),
    ...results.categories.map((c) => ({ type: 'category' as const, href: `/category/${c.slug}`, label: c.name })),
    ...results.guides.map((g) => ({ type: 'guide' as const, href: `/guides/${g.slug}`, label: g.title })),
  ];

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const goSearch = () => {
    if (!query) return;
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form
        action="/shop"
        method="get"
        onSubmit={(e) => { e.preventDefault(); goSearch(); }}
        className="flex items-center overflow-hidden rounded-full bg-white shadow-inner"
      >
        <input
          name="q"
          value={q}
          autoFocus={autoFocus}
          autoComplete="off"
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, total)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
            else if (e.key === 'Enter') {
              if (active >= 0 && active < flat.length) { e.preventDefault(); setOpen(false); router.push(flat[active].href); }
            } else if (e.key === 'Escape') { setOpen(false); }
          }}
          placeholder="Search products, brands..."
          className={`w-full text-sm text-slate-800 outline-none ${inputClassName}`}
        />
        <button type="submit" className="shrink-0 bg-brand px-4 py-1.5 text-sm font-bold text-white transition hover:bg-brand-dark">Search</button>
      </form>

      {open && query.length >= 1 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl bg-white py-2 text-left text-sm text-slate-800 shadow-2xl ring-1 ring-black/5">
          {total === 0 ? (
            <p className="px-4 py-3 text-slate-500">No matches for “{q.trim()}” — press Search to see all results.</p>
          ) : (
            <>
              {results.products.length > 0 && (
                <>
                  <p className="px-4 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-slate-400">Products</p>
                  {results.products.map((p, i) => (
                    <Link key={p.slug} href={`/product/${p.slug}`} onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 transition hover:bg-blue-50 ${active === i ? 'bg-blue-50' : ''}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{p.name}</span>
                        <span className="text-xs text-slate-500">{p.category}</span>
                      </span>
                      <span className="shrink-0 font-bold text-navy">${p.price.toFixed(2)}</span>
                    </Link>
                  ))}
                </>
              )}
              {results.categories.length > 0 && (
                <>
                  <p className="px-4 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-slate-400">Categories</p>
                  {results.categories.map((c, i) => {
                    const idx = results.products.length + i;
                    return (
                      <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setOpen(false)}
                        className={`block px-4 py-2 font-semibold transition hover:bg-blue-50 ${active === idx ? 'bg-blue-50' : ''}`}>
                        {c.name} <span className="font-normal text-slate-500">— shop category</span>
                      </Link>
                    );
                  })}
                </>
              )}
              {results.guides.length > 0 && (
                <>
                  <p className="px-4 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-slate-400">Buying Guides</p>
                  {results.guides.map((g, i) => {
                    const idx = results.products.length + results.categories.length + i;
                    return (
                      <Link key={g.slug} href={`/guides/${g.slug}`} onClick={() => setOpen(false)}
                        className={`block px-4 py-2 font-semibold transition hover:bg-blue-50 ${active === idx ? 'bg-blue-50' : ''}`}>
                        {g.title}
                      </Link>
                    );
                  })}
                </>
              )}
            </>
          )}
          <button
            type="button"
            onClick={goSearch}
            className={`block w-full border-t px-4 py-2.5 text-left font-bold text-brand transition hover:bg-orange-50 ${active === total ? 'bg-orange-50' : ''}`}
          >
            Search for “{q.trim()}” →
          </button>
        </div>
      )}
    </div>
  );
}
