import { readDb } from '@/lib/db';
export const dynamic = 'force-dynamic';
export default function AboutPage() {
  const db = readDb();
  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="text-3xl font-black text-navy">About {db.settings.siteName}</h1>
      <p className="mt-4 leading-relaxed text-slate-700">{db.settings.siteName} is an Amazon affiliate website. We hand-pick well-reviewed products across Electronics, Fashion, Home, Beauty and Sports, show the real discount, and link you to Amazon to buy. We do not sell or ship anything ourselves — every purchase happens on Amazon, with Amazon&apos;s prices, delivery and returns.</p>
      <p className="mt-4 leading-relaxed text-slate-700">When you buy through a &quot;Buy on Amazon&quot; link, we may earn a small commission at no extra cost to you. That is how this site is funded. Contact us at {db.settings.contactEmail}.</p>
      <p className="mt-4 text-xs text-slate-400">As an Amazon Associate I earn from qualifying purchases.</p>
    </div>
  );
}
