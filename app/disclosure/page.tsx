import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Affiliate Disclosure — ZayPick', description: 'ZayPick is a participant in the Amazon Associates Program. As an Amazon Associate I earn from qualifying purchases.' };

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl py-6">
      <h1 className="text-2xl font-black text-navy sm:text-3xl">Affiliate Disclosure</h1>
      <p className="mt-4 leading-relaxed text-slate-700">ZayPick is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.</p>
      <h2 className="mt-8 text-xl font-black text-navy">What this means for you</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate-700">
        <li><strong>As an Amazon Associate I earn from qualifying purchases.</strong> When you click a &quot;Buy on Amazon&quot; link on this site and buy something on Amazon, we may earn a commission.</li>
        <li><strong>It costs you nothing extra.</strong> The price you pay on Amazon is the same whether you come from ZayPick or go to Amazon directly.</li>
        <li><strong>It does not decide what we recommend.</strong> Products are picked for their reviews and their discount — not for the size of the commission.</li>
      </ul>
      <h2 className="mt-8 text-xl font-black text-navy">Prices and availability</h2>
      <p className="mt-3 leading-relaxed text-slate-700">Prices and availability shown on this site are as of the &quot;Price as of&quot; date shown on each product, and they may change on Amazon at any time. Always check the current price, availability and delivery details on Amazon before you buy — the price on Amazon is the one that counts.</p>
      <h2 className="mt-8 text-xl font-black text-navy">Reviews and opinions</h2>
      <p className="mt-3 leading-relaxed text-slate-700">Ratings and review counts shown on ZayPick come from Amazon product pages at the time we listed the product. We do not write fake reviews, and we do not hide the downsides — every product page lists pros and cons.</p>
      <p className="mt-4 text-sm text-slate-500">Last updated: 23 November 2026. Contact: hello@zaypick.com.</p>
    </div>
  );
}
