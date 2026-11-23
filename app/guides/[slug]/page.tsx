import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const db = readDb();
  const guide = db.guides.find((g) => g.slug === params.slug);
  if (!guide) return { title: 'Guide — ZayPick' };
  return { title: `${guide.title} — ZayPick`, description: guide.excerpt };
}

function renderContent(content: string) {
  const blocks = content.split('\n\n').filter(Boolean);
  return blocks.map((block, i) => {
    if (block.startsWith('## ')) {
      return <h2 key={i} className="mt-8 text-xl font-black text-navy">{block.replace('## ', '')}</h2>;
    }
    if (block.split('\n').every((l) => l.startsWith('- '))) {
      return (
        <ul key={i} className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-slate-700">
          {block.split('\n').map((l) => <li key={l}>{l.replace('- ', '')}</li>)}
        </ul>
      );
    }
    return <p key={i} className="mt-4 leading-relaxed text-slate-700">{block}</p>;
  });
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const db = readDb();
  const guide = db.guides.find((g) => g.slug === params.slug);
  if (!guide) notFound();
  const related = guide.relatedProductSlug ? db.products.find((p) => p.slug === guide.relatedProductSlug) : undefined;
  return (
    <article className="mx-auto max-w-3xl py-6">
      <p className="text-sm text-slate-500"><Link href="/guides" className="hover:text-brand">← All guides</Link></p>
      <h1 className="mt-2 text-2xl font-black text-navy sm:text-3xl">{guide.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{guide.category} · {guide.date} · ZayPick Team</p>
      <div className="relative mt-4 h-64 overflow-hidden rounded-3xl bg-slate-200 sm:h-72"><Image src={guide.image} alt={guide.title} fill className="object-cover" /></div>
      <div>{renderContent(guide.content)}</div>
      {related && (
        <section className="mt-10">
          <h2 className="text-xl font-black text-navy">Our pick from this guide</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <ProductCard product={related} tag={db.settings.amazonTag} />
            <div className="flex flex-col justify-center rounded-2xl border p-5">
              <p className="font-bold">{related.name}</p>
              <p className="mt-2 text-sm text-slate-600">This is the product this guide recommends. Prices change on Amazon — check the current price before you buy.</p>
              <Link href={`/product/${related.slug}`} className="mt-4 font-bold text-brand hover:underline">See full details →</Link>
            </div>
          </div>
        </section>
      )}
      <p className="mt-8 text-xs text-slate-400">As an Amazon Associate I earn from qualifying purchases.</p>
    </article>
  );
}
