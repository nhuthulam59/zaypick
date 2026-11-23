import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() { return NextResponse.json(readDb().categories); }

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const body = await req.json();
  const db = readDb();
  const cat = {
    id: body.id || `c${Date.now()}`,
    slug: body.slug || String(body.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: body.name || 'Category',
    image: body.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    description: body.description || '',
  };
  const i = db.categories.findIndex((c) => c.id === cat.id);
  if (i >= 0) db.categories[i] = cat; else db.categories.push(cat);
  writeDb(db);
  return NextResponse.json(cat, { status: 201 });
}

export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get('id');
  const db = readDb();
  db.categories = db.categories.filter((c) => c.id !== id);
  writeDb(db);
  return NextResponse.json({ ok: true });
}
