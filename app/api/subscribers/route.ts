import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireAdmin, getClientIp } from '@/lib/auth';
import { checkRateLimit, rateLimitResponse } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// GET is admin-only: the subscriber list contains private email addresses.
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json(readDb().subscribers);
}

export async function POST(req: Request) {
  // Public signup, but rate-limited: max 5 signups per IP per hour.
  const ip = getClientIp(req);
  const { allowed, retryAfterSec } = checkRateLimit(`subscribe:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) return rateLimitResponse(retryAfterSec);

  let email = '';
  try {
    const body = await req.json();
    email = typeof body?.email === 'string' ? body.email.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }
  const db = readDb();
  if (!db.subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    db.subscribers.push({ email, date: new Date().toISOString().slice(0, 10) });
    writeDb(db);
  }
  return NextResponse.json({ ok: true });
}
