import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const db = readDb();
  const cat = db.categories.find((c) => c.slug === params.slug);
  if (!cat) return { title: 'Category — ZayPick' };
  const title = `${cat.name} Deals — ZayPick`;
  const description = `${cat.description} Hand-picked ${cat.name} deals from Amazon.`;
  const url = `https://zaypick.vercel.app/category/${cat.slug}`;
  const hasProducts = db.products.some((p) => p.category === cat.slug);
  return {
    title,
    description,
    alternates: { canonical: url },
    // Empty category: a thin page Google should not index yet. This lifts
    // automatically once the first product is added to the category.
    ...(hasProducts ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url,
      siteName: 'ZayPick',
      type: 'website',
      images: [{ url: cat.image, alt: cat.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [cat.image],
    },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const db = readDb();
  const cat = db.categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const products = db.products.filter((p) => p.category === cat.slug);
  return (
    <div className="py-6">
      <h1 className="text-2xl font-black text-navy sm:text-3xl">{cat.name}</h1>
      <p className="mt-1 text-slate-500">{cat.description} · {products.length} product(s)</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p} tag={db.settings.amazonTag} />)}
      </div>
      {products.length === 0 && <p className="mt-8 rounded-2xl border p-8 text-center text-slate-500">No products in this category yet — add some from the admin panel.</p>}
    </div>
  );
}
