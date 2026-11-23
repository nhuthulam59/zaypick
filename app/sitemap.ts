import type { MetadataRoute } from 'next';
import { readDb } from '@/lib/db';

const BASE = 'https://zaypick.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const db = readDb();
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/disclosure`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];
  for (const c of db.categories || []) {
    urls.push({ url: `${BASE}/category/${c.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.8 });
  }
  for (const p of db.products || []) {
    urls.push({ url: `${BASE}/product/${p.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 });
  }
  for (const g of db.guides || []) {
    urls.push({ url: `${BASE}/guides/${g.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 });
  }
  return urls;
}
