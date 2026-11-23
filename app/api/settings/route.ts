import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() { return NextResponse.json(readDb().settings); }

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const body = await req.json();
  const db = readDb();
  db.settings = { ...db.settings, ...body };
  writeDb(db);
  return NextResponse.json(db.settings);
}
