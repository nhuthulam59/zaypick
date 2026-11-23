'use client';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch('/api/subscribers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    setMsg(r.ok ? 'Thanks! You are signed up for deal alerts.' : 'Please enter a valid email address.');
    if (r.ok) setEmail('');
  }
  return (
    <section className="rounded-3xl bg-amber-50 p-6 text-center sm:p-8">
      <h2 className="text-2xl font-black text-navy">Never miss a deal</h2>
      <p className="mt-1 text-slate-600">Get the best Amazon deals in your inbox. No spam, unsubscribe anytime.</p>
      <form onSubmit={submit} className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="w-full rounded-full border px-4 py-2.5 outline-none focus:border-brand" />
        <button className="w-full shrink-0 rounded-full bg-brand px-5 py-2.5 font-bold text-white hover:bg-brand-dark sm:w-auto">Sign up</button>
      </form>
      {msg && <p className="mt-3 text-sm font-medium text-green-700">{msg}</p>}
    </section>
  );
}
