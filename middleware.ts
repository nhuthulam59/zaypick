import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Defence in depth at the edge. The server-side checks in lib/auth.ts are
// the real enforcement — this middleware only stops unauthenticated traffic
// earlier, and is the ONLY protection for routes whose files are owned by
// another in-flight change (GET /api/clicks and GET /api/visits, which
// return private visitor data including IP addresses).

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get('zaypick_admin')?.value === '1';
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

// Tiny in-memory rate limiter for the edge (per edge instance, best effort).
const buckets = new Map<string, { count: number; resetAt: number }>();
function rateLimited(key: string, limit: number, windowMs: number): number {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return 0;
  }
  if (entry.count >= limit) return Math.ceil((entry.resetAt - now) / 1000);
  entry.count += 1;
  return 0;
}

const WRITE_PATHS = ['/api/products', '/api/categories', '/api/guides', '/api/settings', '/api/db'];
const PRIVATE_GET_PATHS = ['/api/db', '/api/subscribers', '/api/clicks', '/api/visits'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // --- Admin pages ---
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAdmin(req)) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    // Login/logout are public by design (login has its own server-side
    // rate limit and no default password).
    if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
      return NextResponse.next();
    }

    // --- Writes to admin data: admin only ---
    if (
      WRITE_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/')) &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
    ) {
      if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized — admin login required' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // --- Private data reads: admin only (subscriber emails, click stats,
    // visitor IPs/countries in /api/visits must never be public) ---
    if (method === 'GET' && PRIVATE_GET_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
      if (!isAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized — admin login required' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // --- Public POST endpoints: rate-limited, still public ---
    if (method === 'POST') {
      const ip = clientIp(req);
      if (pathname === '/api/clicks') {
        const retry = rateLimited(`clicks:${ip}`, 30, 60 * 1000);
        if (retry) {
          return NextResponse.json({ error: 'Too many requests — try again later' }, { status: 429, headers: { 'Retry-After': String(retry) } });
        }
      }
      if (pathname === '/api/subscribers') {
        const retry = rateLimited(`subscribe:${ip}`, 5, 60 * 60 * 1000);
        if (retry) {
          return NextResponse.json({ error: 'Too many requests — try again later' }, { status: 429, headers: { 'Retry-After': String(retry) } });
        }
      }
      if (pathname === '/api/visits') {
        const retry = rateLimited(`visits:${ip}`, 120, 60 * 1000);
        if (retry) {
          return NextResponse.json({ error: 'Too many requests — try again later' }, { status: 429, headers: { 'Retry-After': String(retry) } });
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/api/:path*'] };
