import type { MetadataRoute } from 'next';
import { readDb } from '@/lib/db';

const BASE = 'https://zaypick.vercel.app';

// Static pages have no per-page update date in the data, so use the site's
// last real content date (2026-11-23) instead of "now" — a sitemap
// lastModified that changes on every request tells Google nothing.
const STATIC_DATE = new Date('2026-11-23');

export default function sitemap(): MetadataRoute.Sitemap {
  const db = readDb();
  const urls: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/shop`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/about`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/disclosure`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.3 },
  ];
  // /guides is left out while there are no guides: an empty guides page is
  // a thin page Google should not index yet. It is added back automatically
  // once the first guide is published (see below).
  if ((db.guides || []).length > 0) {
    urls.push({ url: `${BASE}/guides`, lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.7 });
  }
  for (const c of db.categories || []) {
    const items = (db.products || []).filter((p) => p.category === c.slug);
    // Empty categories (no products yet) are left out of the sitemap and
    // noindexed on the page itself, so Google does not index thin pages.
    if (items.length === 0) continue;
    const last = items
      .map((p) => p.priceAsOf)
      .filter(Boolean)
      .sort()
      .pop();
    urls.push({
      url: `${BASE}/category/${c.slug}`,
      lastModified: last ? new Date(last) : STATIC_DATE,
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }
  for (const p of db.products || []) {
    urls.push({
      url: `${BASE}/product/${p.slug}`,
      // Real date: the day the price was last checked on Amazon.
      lastModified: p.priceAsOf ? new Date(p.priceAsOf) : STATIC_DATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }
  for (const g of db.guides || []) {
    urls.push({
      url: `${BASE}/guides/${g.slug}`,
      lastModified: g.date ? new Date(g.date) : STATIC_DATE,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }
  return urls;
}
