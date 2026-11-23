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
    if (r.ok) router.push('/admin'); else setErr('Wrong password. Default is admin123 — change it in .env (ADMIN_PASSWORD).');
  }
  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-2xl font-black text-navy">Admin Login</h1>
      <p className="mt-1 text-sm text-slate-500">Password is set by ADMIN_PASSWORD in your environment. Default: admin123.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" className="w-full rounded-lg border px-4 py-3 outline-none focus:border-brand" />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-full bg-navy py-3 font-bold text-white hover:bg-navy-light">Log in</button>
      </form>
    </div>
  );
}
