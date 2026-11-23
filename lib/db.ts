import fs from 'fs';
import path from 'path';
import type { Db } from './types';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

let memoryDb: Db | null = null;

export function readDb(): Db {
  if (memoryDb) return memoryDb;
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(raw) as Db;
    memoryDb = db;
    return db;
  } catch {
    // Fallback empty db (should not happen — data/db.json is shipped)
    return {
      products: [],
      categories: [],
      guides: [],
      settings: {
        siteName: 'ZayPick',
        tagline: 'Hand-picked deals from Amazon',
        amazonTag: 'zaypick-20',
        heroTitle: 'Seasonal Savings',
        heroSubtitle: 'Big discounts on top picks across Electronics, Fashion, Home, Beauty & Sports',
        heroBadge: 'Up to 42% Off',
        contactEmail: 'hello@zaypick.com',
        amazonApiKey: '',
      },
      clicks: [],
      subscribers: [],
    };
  }
}

export function writeDb(db: Db): boolean {
  memoryDb = db;
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    return true;
  } catch {
    // On Vercel serverless the filesystem is read-only / per-instance.
    // Keep the change in memory for this instance and let the admin
    // Export JSON to save it durably. See README.
    return false;
  }
}

export function getSettings() {
  return readDb().settings;
}
