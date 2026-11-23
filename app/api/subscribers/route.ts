import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() { return NextResponse.json(readDb().subscribers); }

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email || !String(email).includes('@')) return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  const db = readDb();
  if (!db.subscribers.some((s) => s.email.toLowerCase() === String(email).toLowerCase())) {
    db.subscribers.push({ email: String(email), date: new Date().toISOString().slice(0, 10) });
    writeDb(db);
  }
  return NextResponse.json({ ok: true });
}
