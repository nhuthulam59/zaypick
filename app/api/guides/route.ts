import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() { return NextResponse.json(readDb().guides); }

export async function POST(req: Request) {
  const body = await req.json();
  const db = readDb();
  const guide = {
    id: body.id || `g${Date.now()}`,
    slug: body.slug || String(body.title || 'guide').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: body.title || 'Guide',
    excerpt: body.excerpt || '',
    category: body.category || 'Electronics',
    date: body.date || new Date().toISOString().slice(0, 10),
    image: body.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    content: body.content || '',
  };
  const i = db.guides.findIndex((g) => g.id === guide.id);
  if (i >= 0) db.guides[i] = guide; else db.guides.push(guide);
  writeDb(db);
  return NextResponse.json(guide, { status: 201 });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const db = readDb();
  db.guides = db.guides.filter((g) => g.id !== id);
  writeDb(db);
  return NextResponse.json({ ok: true });
}
