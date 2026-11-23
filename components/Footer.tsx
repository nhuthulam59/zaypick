import Link from 'next/link';
import { readDb } from '@/lib/db';

export default function Footer() {
  const db = readDb();
  return (
    <footer className="mt-16 bg-navy-dark text-slate-300">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:py-12 lg:grid-cols-4">
        <div className="col-span-2 lg:col-span-1">
          <p className="text-xl font-black text-white">{db.settings.siteName}.</p>
          <p className="mt-2 text-sm">{db.settings.tagline}. We find the best Amazon deals across every category, so you do not have to.</p>
          <p className="mt-3 text-xs text-slate-400">As an Amazon Associate I earn from qualifying purchases.</p>
        </div>
        <div>
          <p className="font-bold text-white">Shop</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-white">All Products</Link></li>
            {db.categories.map((c) => (<li key={c.id}><Link href={`/category/${c.slug}`} className="hover:text-white">{c.name}</Link></li>))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-white">Learn</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/guides" className="hover:text-white">Buying Guides</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-white">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/disclosure" className="hover:text-white">Affiliate Disclosure</Link></li>
            <li><a href={`mailto:${db.settings.contactEmail}`} className="hover:text-white">{db.settings.contactEmail}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {db.settings.siteName} — As an Amazon Associate I earn from qualifying purchases. Prices change on Amazon; check the current price before you buy.
      </div>
    </footer>
  );
}
