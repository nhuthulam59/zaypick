import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { readDb } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  const db = readDb();
  const hasGuides = (db.guides || []).length > 0;
  return {
    title: 'Buying Guides — ZayPick',
    // Honest while there are no guides yet: no product names are promised.
    description: hasGuides
      ? 'Simple, honest buying guides — what to check before you buy on Amazon.'
      : 'ZayPick buying guides are coming soon — simple, honest advice on what to check before you buy on Amazon. Meanwhile, browse our hand-picked deals.',
    alternates: { canonical: 'https://zaypick.vercel.app/guides' },
    // No guides published yet, so do not let Google index this thin page.
    // This lifts automatically once the first guide is published.
    ...(hasGuides ? {} : { robots: { index: false, follow: true } }),
  };
}

export const dynamic = 'force-dynamic';

export default function GuidesPage() {
  const db = readDb();
  return (
    <div className="py-6">
      <h1 className="text-2xl font-black text-navy sm:text-3xl">Buying Guides</h1>
      <p className="mt-1 text-slate-500">Simple, honest guides to help you choose the right product on Amazon.</p>
      {db.guides.length === 0 && (
        <p className="mt-6 rounded-2xl border p-8 text-center text-slate-500">No buying guides published yet — we are working on the first ones. Meanwhile, browse the <Link href="/shop" className="font-bold text-brand hover:underline">best deals</Link>.</p>
      )}
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
