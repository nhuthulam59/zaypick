'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (r.ok) router.push('/admin');
    else {
      // Show the server's message (e.g. password not set, or too many attempts)
      // instead of always saying "wrong password".
      const data = await r.json().catch(() => null);
      setErr(data?.error || 'ভুল পাসওয়ার্ড। আবার চেষ্টা করো।');
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <p className="text-center text-4xl font-bold leading-none text-navy">ZayPick</p>
        <h1 className="mt-4 text-center text-3xl font-bold text-navy">অ্যাডমিন লগইন</h1>
        <p className="mt-2 text-center text-base text-slate-500">শুধু সাইটের মালিকের জন্য। পাসওয়ার্ডটা কাউকে জানিও না।</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="অ্যাডমিন পাসওয়ার্ড" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-lg shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-orange-100" />
          {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-base font-bold text-red-600">{err}</p>}
          <button className="w-full rounded-full bg-navy py-3.5 text-lg font-bold text-white shadow-md hover:bg-navy-light">লগইন করুন</button>
        </form>
        <a href="/" className="mt-6 block text-center text-base font-bold text-brand">← সাইটে ফিরে যান</a>
      </div>
    </div>
  );
}
