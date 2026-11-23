import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function GuidePage({ params }: { params: { slug: string } }) {
  const db = readDb();
  const guide = db.guides.find((g) => g.slug === params.slug);
  if (!guide) notFound();
  return (
    <article className="mx-auto max-w-3xl py-6">
      <p className="text-sm text-slate-500"><Link href="/guides" className="hover:text-brand">← All guides</Link></p>
      <h1 className="mt-2 text-3xl font-black text-navy">{guide.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{guide.category} · {guide.date}</p>
      <div className="relative mt-4 h-72 overflow-hidden rounded-3xl"><Image src={guide.image} alt={guide.title} fill className="object-cover" /></div>
      <p className="mt-6 leading-relaxed text-slate-700">{guide.content}</p>
      <p className="mt-6 text-xs text-slate-400">As an Amazon Associate I earn from qualifying purchases.</p>
    </article>
  );
}
