import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import type { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(readDb().products);
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const body = (await req.json()) as Partial<Product>;
  const db = readDb();
  const product: Product = {
    id: body.id || `p${Date.now()}`,
    slug: body.slug || (body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name: body.name || 'Untitled product',
    category: body.category || 'electronics',
    price: Number(body.price) || 0,
    oldPrice: Number(body.oldPrice) || 0,
    rating: Number(body.rating) || 4,
    reviews: Number(body.reviews) || 0,
    badge: body.badge || '',
    image: body.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    asin: body.asin || '',
    description: body.description || '',
    highlights: body.highlights || [],
    pros: body.pros || [],
    cons: body.cons || [],
    amazonUrl: body.amazonUrl || '',
    priceAsOf: body.priceAsOf || new Date().toISOString().slice(0, 10),
  };
  const existing = db.products.findIndex((p) => p.id === product.id);
  if (existing >= 0) db.products[existing] = product; else db.products.push(product);
  writeDb(db);
  return NextResponse.json(product, { status: 201 });
}

export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const db = readDb();
  db.products = db.products.filter((p) => p.id !== id);
  db.clicks = db.clicks.filter((c) => c.productId !== id);
  writeDb(db);
  return NextResponse.json({ ok: true });
}
