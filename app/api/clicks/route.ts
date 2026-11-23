import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() { return NextResponse.json(readDb().clicks); }

export async function POST(req: Request) {
  const { productId, visitorId } = await req.json();
  const db = readDb();
  const product = db.products.find((p) => p.id === productId);
  const row = db.clicks.find((c) => c.productId === productId);
  if (row) { row.count += 1; row.lastClicked = new Date().toISOString(); }
  else db.clicks.push({ productId, productName: product?.name || productId, count: 1, lastClicked: new Date().toISOString() });
  // Per-visitor click event, linked to the same visitor id the tracker uses.
  if (typeof visitorId === 'string' && visitorId) {
    if (!db.clickEvents) db.clickEvents = [];
    const visits = db.visits || [];
    const latest = [...visits].reverse().find((v) => v.visitorId === visitorId);
    db.clickEvents.push({
      visitorId: visitorId.slice(0, 64),
      productId,
      productName: product?.name || productId,
      time: new Date().toISOString(),
      ip: latest?.ip,
      country: latest?.country,
    });
    if (db.clickEvents.length > 2000) db.clickEvents = db.clickEvents.slice(-2000);
  }
  writeDb(db);
  return NextResponse.json({ ok: true });
}
