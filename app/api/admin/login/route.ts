import { NextResponse } from 'next/server';
import { getClientIp } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// Max 5 failed login attempts per IP per 15 minutes.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  const ip = getClientIp(req);

  const expected = process.env.ADMIN_PASSWORD;
  // SECURITY: no default password. If ADMIN_PASSWORD is not set in Vercel,
  // login is disabled entirely — nobody can log in, including the owner,
  // until a strong password is set and the site is redeployed.
  if (!expected) {
    return NextResponse.json(
      {
        error:
          'Admin password is not set. Set ADMIN_PASSWORD in Vercel → Settings → Environment Variables and redeploy.',
      },
      { status: 503 }
    );
  }

  let password = '';
  try {
    const body = await req.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (password !== expected) {
    const { allowed, retryAfterSec } = checkRateLimit(
      `login:${ip}`,
      MAX_ATTEMPTS,
      WINDOW_MS
    );
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many failed attempts — try again later' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
      );
    }
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('zaypick_admin', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours (was 7 days)
    sameSite: 'lax',
  });
  return res;
}
