import type { Metadata } from 'next';
import Link from 'next/link';
import { readDb } from '@/lib/db';

export const metadata: Metadata = { title: 'About ZayPick', description: 'ZayPick is an Amazon affiliate site that hand-picks well-reviewed deals across Electronics, Fashion, Home, Beauty and Sports.', alternates: { canonical: 'https://zaypick.vercel.app/about' } };

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const db = readDb();
  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="text-2xl font-black text-navy sm:text-3xl">About {db.settings.siteName}</h1>
      <p className="mt-4 leading-relaxed text-slate-700">{db.settings.siteName} is an Amazon affiliate website. We hand-pick well-reviewed products across Electronics, Fashion, Home, Beauty and Sports, show the real discount, and link you to Amazon to buy. We do not sell or ship anything ourselves — every purchase happens on Amazon, with Amazon&apos;s prices, delivery and returns.</p>
      <h2 className="mt-8 text-xl font-black text-navy">How ZayPick works</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-slate-700">
        <li><strong>We pick.</strong> We look for products with strong reviews, a real discount, and a seller you can trust.</li>
        <li><strong>We show the real price.</strong> Every product shows the current price, the old price, and the date the price was checked (&quot;Price as of&quot;).</li>
        <li><strong>You buy on Amazon.</strong> Clicking &quot;Buy on Amazon&quot; takes you to Amazon, where you pay Amazon — not us — and Amazon handles delivery, returns and customer service.</li>
      </ol>
      <h2 className="mt-8 text-xl font-black text-navy">How we choose products</h2>
      <p className="mt-3 leading-relaxed text-slate-700">We favour products with a rating of 4 stars or more, a meaningful number of reviews, and a clear discount from the old price. We do not list a product just because the discount looks big — if the reviews are weak or the price history looks suspicious, we leave it out.</p>
      <h2 className="mt-8 text-xl font-black text-navy">How this site is funded</h2>
      <p className="mt-3 leading-relaxed text-slate-700">When you buy through a &quot;Buy on Amazon&quot; link, we may earn a small commission at no extra cost to you. That is how this site is funded. It never changes the price you pay, and it never decides which products we recommend — the reviews and the discount do.</p>
      <h2 className="mt-8 text-xl font-black text-navy">What ZayPick is not</h2>
      <p className="mt-3 leading-relaxed text-slate-700">ZayPick is not a shop. We hold no stock, take no payments, and cannot help with orders, delivery or returns — for those, please contact Amazon directly. Prices and availability on Amazon change often, so always check the current price on Amazon before you buy.</p>
      <p className="mt-6 rounded-2xl bg-slate-50 p-5">Questions or a product you would like us to feature? <Link href="/contact" className="font-bold text-brand hover:underline">Contact us</Link> or email <a className="font-bold text-blue-700 hover:underline" href={`mailto:${db.settings.contactEmail}`}>{db.settings.contactEmail}</a>.</p>
      <p className="mt-4 text-xs text-slate-400">As an Amazon Associate I earn from qualifying purchases.</p>
    </div>
  );
}
