import { NextResponse } from 'next/server';

// Shared server-side admin check for API routes.
// The admin session is a cookie set by /api/admin/login after the password
// check. This is the real enforcement — middleware is defence in depth only.
export function isAdmin(req: Request): boolean {
  const cookie = req.headers.get('cookie') || '';
  return /(?:^|;\s*)zaypick_admin=1(?:;|$)/.test(cookie);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/** Returns a 401 response when the caller is not logged in, otherwise null. */
export function requireAdmin(req: Request): NextResponse | null {
  if (isAdmin(req)) return null;
  return NextResponse.json(
    { error: 'Unauthorized — admin login required' },
    { status: 401 }
  );
}
