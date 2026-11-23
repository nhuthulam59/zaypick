'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/lib/types';
import SearchBox, { type SearchProduct, type SearchGuide } from '@/components/SearchBox';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/guides', label: 'Buying Guides' },
  { href: '/about', label: 'About' },
];

export default function MobileMenu({ siteName, categories, products, guides }: { siteName: string; categories: Category[]; products: SearchProduct[]; guides: SearchGuide[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Single mobile header row: hamburger | logo | search button */}
      <div className="flex items-center gap-2 px-3 py-3">
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
          className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full bg-white/15 transition hover:bg-brand"
        >
          <span className={`block h-[2px] w-5 bg-white transition-transform ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-transform ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex min-w-0 flex-1 items-center gap-2">
          <Image src="/zaypick-logo.webp" alt="ZayPick" width={1600} height={1600} className="h-8 w-8 shrink-0 rounded-lg object-cover" />
          <span className="min-w-0 truncate text-xl font-black tracking-tight">
            {siteName}<span className="text-brand">.</span>
          </span>
        </Link>
        <button
          type="button"
          aria-label={searchOpen ? 'Close search' : 'Open search'}
          aria-expanded={searchOpen}
          onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-dark"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-5 w-5"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </button>
      </div>

      {/* Mobile search row — shown only when the search button is tapped */}
      {searchOpen && (
        <SearchBox products={products} categories={categories} guides={guides} autoFocus inputClassName="px-4 py-2.5" className="mx-3 mb-3" />
      )}

      {/* Mobile slide-down menu — Home / Shop / Buying Guides / About, All Departments, Admin */}
      {menuOpen && (
        <nav className="max-h-[75vh] overflow-y-auto border-t border-white/10 bg-navy px-3 pb-5 pt-2">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-base font-bold transition hover:bg-brand">
              {l.label}
            </Link>
          ))}
          <p className="mt-3 px-3 pb-1 text-xs font-bold uppercase tracking-wider text-white/60">All Departments</p>
          {categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-[15px] font-semibold text-white/90 transition hover:bg-brand hover:text-white">
              {c.name}
            </Link>
          ))}
          <Link href="/shop?badge=deal" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2.5 text-[15px] font-bold text-red-400 transition hover:bg-brand hover:text-white">🔥 Today&apos;s Deals</Link>
          <Link href="/admin" onClick={() => setMenuOpen(false)} className="mt-3 block rounded-xl bg-white/15 px-3 py-3 text-base font-bold transition hover:bg-brand">
            Admin
          </Link>
        </nav>
      )}
    </div>
  );
}
