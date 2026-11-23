import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() { return NextResponse.json(readDb().clicks); }

export async function POST(req: Request) {
  const { productId } = await req.json();
  const db = readDb();
  const product = db.products.find((p) => p.id === productId);
  const row = db.clicks.find((c) => c.productId === productId);
  if (row) { row.count += 1; row.lastClicked = new Date().toISOString(); }
  else db.clicks.push({ productId, productName: product?.name || productId, count: 1, lastClicked: new Date().toISOString() });
  writeDb(db);
  return NextResponse.json({ ok: true });
}
