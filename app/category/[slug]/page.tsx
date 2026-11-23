import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const db = readDb();
  const cat = db.categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();
  const products = db.products.filter((p) => p.category === cat.slug);
  return (
    <div className="py-6">
      <h1 className="text-3xl font-black text-navy">{cat.name}</h1>
      <p className="mt-1 text-slate-500">{cat.description} · {products.length} product(s)</p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p} tag={db.settings.amazonTag} />)}
      </div>
      {products.length === 0 && <p className="mt-8 rounded-2xl border p-8 text-center text-slate-500">No products in this category yet — add some from the admin panel.</p>}
    </div>
  );
}
