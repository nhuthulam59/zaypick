import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import type { Visit } from '@/lib/types';

export const dynamic = 'force-dynamic';

function sourceFromReferrer(referrer: string): string {
  if (!referrer) return 'Direct';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes('google.')) return 'Google';
    if (host.includes('facebook.') || host.includes('fb.')) return 'Facebook';
    if (host.includes('instagram.')) return 'Instagram';
    if (host.includes('youtube.') || host.includes('youtu.be')) return 'YouTube';
    if (host.includes('bing.')) return 'Bing';
    if (host.includes('zaypick.vercel.app')) return 'Direct';
    return 'Other';
  } catch {
    return 'Other';
  }
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'Unknown';
}

function decodeHeader(v: string | null): string {
  if (!v) return 'Unknown';
  try { return decodeURIComponent(v); } catch { return v; }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const visitorId = typeof body.visitorId === 'string' && body.visitorId ? body.visitorId.slice(0, 64) : 'unknown';
    const path = typeof body.path === 'string' && body.path ? body.path.slice(0, 200) : '/';
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : '';
    const device = body.device === 'mobile' ? 'mobile' : 'desktop';
    const now = new Date();
    const db = readDb();
    if (!db.visits) db.visits = [];
    const visit: Visit = {
      id: `vst_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      visitorId,
      date: now.toISOString().slice(0, 10),
      time: now.toISOString(),
      path,
      referrer,
      country: req.headers.get('x-vercel-ip-country') || 'Unknown',
      city: decodeHeader(req.headers.get('x-vercel-ip-city')),
      ip: clientIp(req),
      device,
      source: sourceFromReferrer(referrer),
    };
    db.visits.push(visit);
    if (db.visits.length > 2000) db.visits = db.visits.slice(-2000);
    writeDb(db);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET() {
  const db = readDb();
  const visits: Visit[] = db.visits || [];
  const today = new Date().toISOString().slice(0, 10);
  const uniq = (arr: Visit[]) => new Set(arr.map((v) => v.visitorId)).size;

  const days: { date: string; views: number; visitors: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const dayVisits = visits.filter((v) => v.date === d);
    days.push({ date: d, views: dayVisits.length, visitors: uniq(dayVisits) });
  }

  const countBy = (key: (v: Visit) => string) => {
    const m = new Map<string, number>();
    for (const v of visits) { const k = key(v); m.set(k, (m.get(k) || 0) + 1); }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const uniqBy = (key: (v: Visit) => string) => {
    const m = new Map<string, Set<string>>();
    for (const v of visits) {
      if (!m.has(key(v))) m.set(key(v), new Set());
      m.get(key(v))!.add(v.visitorId);
    }
    return [...m.entries()].map(([k, s]) => [k, s.size] as [string, number]).sort((a, b) => b[1] - a[1]);
  };

  return NextResponse.json({
    totalPageviews: visits.length,
    totalVisitors: uniq(visits),
    todayPageviews: visits.filter((v) => v.date === today).length,
    todayVisitors: uniq(visits.filter((v) => v.date === today)),
    last7Days: days,
    topPages: countBy((v) => v.path).slice(0, 10).map(([path, views]) => ({ path, views })),
    topCountries: uniqBy((v) => v.country).map(([country, visitors]) => ({ country, visitors })),
    deviceSplit: countBy((v) => v.device).map(([device, views]) => ({ device, views })),
    topSources: uniqBy((v) => v.source).map(([source, visitors]) => ({ source, visitors })),
    clickEvents: db.clickEvents || [],
    recent: [...visits].reverse().slice(0, 20),
  });
}
