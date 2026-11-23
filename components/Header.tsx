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
        <form action="/shop" method="get" className="flex w-56 shrink-0 items-center overflow-hidden rounded-full bg-white shadow-inner md:w-72">
          <input name="q" placeholder="Search products..." className="w-full px-3 py-1.5 text-sm text-slate-800 outline-none" />
          <button type="submit" className="shrink-0 bg-brand px-3 py-1.5 text-sm font-bold text-white transition hover:bg-brand-dark">Search</button>
        </form>
        <nav className="ml-auto flex shrink-0 flex-wrap items-center gap-1 text-[13px] font-semibold">
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
