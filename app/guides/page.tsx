import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { readDb } from '@/lib/db';

export const metadata: Metadata = { title: 'Buying Guides — ZayPick', description: 'Simple, honest buying guides: headphones, air fryers, running shoes and more — what to check before you buy on Amazon.' };

export const dynamic = 'force-dynamic';

export default function GuidesPage() {
  const db = readDb();
  return (
    <div className="py-6">
      <h1 className="text-2xl font-black text-navy sm:text-3xl">Buying Guides</h1>
      <p className="mt-1 text-slate-500">Simple, honest guides to help you choose the right product on Amazon.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {db.guides.map((g) => (
          <Link key={g.id} href={`/guides/${g.slug}`} className="group overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-44 overflow-hidden"><Image src={g.image} alt={g.title} fill className="object-cover transition group-hover:scale-105" /></div>
            <div className="p-4"><p className="text-xs font-bold uppercase text-brand">{g.category} · {g.date}</p><h2 className="mt-1 font-bold group-hover:text-blue-700">{g.title}</h2><p className="mt-1 text-sm text-slate-500">{g.excerpt}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
