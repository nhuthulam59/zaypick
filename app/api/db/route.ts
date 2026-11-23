import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET = export the whole database as JSON (admin only — never public).
// POST = import a whole database JSON (admin only, replaces data).
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json(readDb());
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const db = await req.json();
    if (!db || !Array.isArray(db.products)) return NextResponse.json({ error: 'Invalid database file' }, { status: 400 });
    writeDb(db);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
