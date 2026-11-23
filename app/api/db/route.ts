import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET = export the whole database as JSON (admin use).
// POST = import a whole database JSON (admin use, replaces data).
export async function GET() { return NextResponse.json(readDb()); }

export async function POST(req: Request) {
  try {
    const db = await req.json();
    if (!db || !Array.isArray(db.products)) return NextResponse.json({ error: 'Invalid database file' }, { status: 400 });
    writeDb(db);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
