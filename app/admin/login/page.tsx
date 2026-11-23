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
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-2xl font-black text-navy">অ্যাডমিন লগইন</h1>
      <p className="mt-1 text-sm text-slate-500">শুধু সাইটের মালিকের জন্য। পাসওয়ার্ডটা কাউকে জানিও না।</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="অ্যাডমিন পাসওয়ার্ড" className="w-full rounded-lg border px-4 py-3 outline-none focus:border-brand" />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-full bg-navy py-3 font-bold text-white hover:bg-navy-light">লগইন করুন</button>
      </form>
    </div>
  );
}
