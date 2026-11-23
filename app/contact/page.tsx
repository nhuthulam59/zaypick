'use client';
import { useState } from 'react';
export default function ContactPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const email = 'hello@zaypick.com';
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`ZayPick contact from ${name || 'a visitor'}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
  }
  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="text-2xl font-black text-navy sm:text-3xl">Contact</h1>
      <p className="mt-4 text-slate-700">Have a question about a product, a deal, or a product you would like us to feature? Send us a message — we usually reply within a few days.</p>
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl border p-5 sm:p-6">
        <label className="text-sm font-bold">Your name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1 w-full rounded-lg border px-3 py-2 font-normal outline-none focus:border-brand" />
        </label>
        <label className="text-sm font-bold">Your message
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder="Write your message here…" className="mt-1 w-full rounded-lg border px-3 py-2 font-normal outline-none focus:border-brand" />
        </label>
        <button className="rounded-full bg-navy px-6 py-2.5 font-bold text-white transition hover:bg-navy-light">Send message</button>
        {sent && <p className="text-sm font-medium text-green-700">Your email app should now be open with the message ready to send.</p>}
      </form>
      <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-lg font-bold">📧 <a className="text-blue-700 hover:underline" href={`mailto:${email}`}>{email}</a></p>
      <h2 className="mt-8 text-xl font-black text-navy">Before you write</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
        <li><strong>Order, delivery or return questions</strong> about something you bought — please contact Amazon directly. We do not handle orders.</li>
        <li><strong>Price questions</strong> — prices change on Amazon, so the price on the day you buy may differ from the &quot;Price as of&quot; date shown here.</li>
        <li><strong>Product requests</strong> — tell us the product name or paste the Amazon link, and we will consider featuring it.</li>
      </ul>
    </div>
  );
}
