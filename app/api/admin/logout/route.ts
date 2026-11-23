import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// POST /api/admin/logout — clears the admin session cookie.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('zaypick_admin', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });
  return res;
}
