import { readDb } from '@/lib/db';
export const dynamic = 'force-dynamic';
export default function ContactPage() {
  const db = readDb();
  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="text-3xl font-black text-navy">Contact</h1>
      <p className="mt-4 text-slate-700">Have a question about a product, a deal, or a product you would like us to feature? Email us — we usually reply within a few days.</p>
      <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-lg font-bold">📧 <a className="text-blue-700 hover:underline" href={`mailto:${db.settings.contactEmail}`}>{db.settings.contactEmail}</a></p>
      <p className="mt-4 text-sm text-slate-500">For order, delivery or return questions about something you bought, please contact Amazon directly — we do not handle orders.</p>
    </div>
  );
}
