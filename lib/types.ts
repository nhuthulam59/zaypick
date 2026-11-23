export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
  asin: string;
  description: string;
  highlights: string[];
  pros: string[];
  cons: string[];
  amazonUrl: string;
  priceAsOf: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
  description: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  content: string;
}

export interface Settings {
  siteName: string;
  tagline: string;
  amazonTag: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  contactEmail: string;
  amazonApiKey: string;
}

export interface Click { productId: string; productName: string; count: number; lastClicked?: string }
export interface Subscriber { email: string; date: string }

export interface Db {
  products: Product[];
  categories: Category[];
  guides: Guide[];
  settings: Settings;
  clicks: Click[];
  subscribers: Subscriber[];
}

export const CATEGORY_NAMES: Record<string, string> = {
  electronics: 'Electronics',
  fashion: 'Fashion',
  home: 'Home',
  beauty: 'Beauty',
  sports: 'Sports',
};

export function categoryName(slug: string) {
  return CATEGORY_NAMES[slug] || slug;
}

export function amazonLink(url: string, tag: string) {
  if (!tag) return url;
  try {
    const u = new URL(url);
    u.searchParams.set('tag', tag);
    return u.toString();
  } catch {
    return url.includes('?') ? `${url}&tag=${tag}` : `${url}?tag=${tag}`;
  }
}

export function discountPct(p: Product) {
  if (!p.oldPrice || p.oldPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}
