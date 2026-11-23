'use client';
import { useEffect, useState } from 'react';
import type { Product, Category, Guide, Settings, Click, Subscriber, Db, Visit, ClickEvent } from '@/lib/types';

type Tab = 'dashboard' | 'products' | 'categories' | 'guides' | 'settings' | 'subscribers' | 'backup' | 'visitors';

interface VisitStats {
  totalPageviews: number;
  totalVisitors: number;
  todayPageviews: number;
  todayVisitors: number;
  last7Days: { date: string; views: number; visitors: number }[];
  topPages: { path: string; views: number }[];
  topCountries: { country: string; visitors: number }[];
  deviceSplit: { device: string; views: number }[];
  topSources: { source: string; visitors: number }[];
  clickEvents: ClickEvent[];
  recent: Visit[];
}

const emptyProduct: Product = { id: '', slug: '', name: '', category: 'electronics', price: 0, oldPrice: 0, rating: 4.5, reviews: 0, badge: '', image: '', asin: '', description: '', highlights: [], pros: [], cons: [], amazonUrl: '', priceAsOf: new Date().toISOString().slice(0, 10) };

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);

  async function load() {
    const [p, c, g, s, k, u, v] = await Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/guides').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
      fetch('/api/clicks').then((r) => r.json()),
      fetch('/api/subscribers').then((r) => r.json()),
      fetch('/api/visits').then((r) => r.json()).catch(() => null),
    ]);
    setProducts(p); setCategories(c); setGuides(g); setSettings(s); setClicks(k); setSubs(u); setStats(v);
  }
  useEffect(() => { load(); }, []);

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const r = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    if (r.ok) { setMsg('প্রোডাক্ট সেভ হয়েছে।'); setEditing(null); load(); } else setMsg('প্রোডাক্ট সেভ করা যায়নি।');
  }
  async function deleteProduct(id: string) {
    if (!confirm('এই প্রোডাক্টটা ডিলিট করবেন?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    load();
  }
  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setMsg('সেটিংস সেভ হয়েছে। মনে রাখবেন: Vercel-এ স্থায়ী কপি রাখতে নিচের Export JSON ব্যবহার করুন।');
  }
  async function exportDb() {
    const r = await fetch('/api/db');
    const blob = new Blob([JSON.stringify(await r.json(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'zaypick-db.json'; a.click();
  }
  async function importDb(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const r = await fetch('/api/db', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: text });
    setMsg(r.ok ? 'ডাটাবেজ ইমপোর্ট হয়েছে।' : 'ইমপোর্ট হয়নি — ফাইলটা ZayPick এক্সপোর্ট কিনা দেখুন।');
    load();
  }

  const totalClicks = clicks.reduce((s, c) => s + c.count, 0);
  const tabs: [Tab, string][] = [['dashboard', 'ড্যাশবোর্ড'], ['visitors', 'রিপোর্ট'], ['products', 'প্রোডাক্ট'], ['categories', 'ক্যাটাগরি'], ['guides', 'গাইড'], ['settings', 'সেটিংস'], ['subscribers', 'সাবস্ক্রাইবার'], ['backup', 'এক্সপোর্ট / ইমপোর্ট']];
  const ctr = stats && stats.totalPageviews > 0 ? ((totalClicks / stats.totalPageviews) * 100).toFixed(1) : '0.0';
  const maxDayViews = stats ? Math.max(1, ...stats.last7Days.map((d) => d.views)) : 1;
  // Group the newest visits + all click events by visitor, newest visitor first.
  const visitorRows = (() => {
    if (!stats) return [];
    const all = new Map<string, { visits: Visit[]; clicks: ClickEvent[] }>();
    for (const v of stats.recent) {
      if (!all.has(v.visitorId)) all.set(v.visitorId, { visits: [], clicks: [] });
      all.get(v.visitorId)!.visits.push(v);
    }
    for (const c of stats.clickEvents || []) {
      if (!all.has(c.visitorId)) all.set(c.visitorId, { visits: [], clicks: [] });
      all.get(c.visitorId)!.clicks.push(c);
    }
    return [...all.values()]
      .map((g) => ({ ...g, latest: g.visits.length ? g.visits[g.visits.length - 1] : undefined }))
      .sort((a, b) => (b.latest?.time || '').localeCompare(a.latest?.time || ''))
      .slice(0, 20);
  })();
  const input = 'w-full rounded-lg border px-3 py-2';

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black text-navy">অ্যাডমিন — ZayPick</h1>
        <a href="/" className="text-sm font-bold text-brand">← সাইট দেখুন</a>
      </div>
      {msg && <p className="mt-3 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-800">{msg}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === t ? 'bg-navy text-white' : 'border hover:bg-slate-50'}`}>{label}</button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[['প্রোডাক্ট', products.length], ['ক্যাটাগরি', categories.length], ['মোট Buy ক্লিক', totalClicks], ['সাবস্ক্রাইবার', subs.length]].map(([label, v]) => (
              <div key={label as string} className="rounded-2xl border p-5 text-center"><p className="text-3xl font-black text-navy">{v}</p><p className="text-sm text-slate-500">{label}</p></div>
            ))}
          </div>
          <div className="rounded-2xl border p-5">
            <h2 className="font-bold">ক্লিকের হিসাব — প্রতি প্রোডাক্টে Buy on Amazon ক্লিক</h2>
            {clicks.length === 0 ? <p className="mt-2 text-sm text-slate-500">এখনো কোনো ক্লিক হয়নি।</p> : (
              <div className="overflow-x-auto"><table className="mt-3 w-full min-w-[320px] text-sm"><tbody>{[...clicks].sort((a, b) => b.count - a.count).map((c) => (<tr key={c.productId} className="border-t"><td className="py-2">{c.productName}</td><td className="py-2 text-right font-bold">{c.count}</td></tr>))}</tbody></table></div>
            )}
          </div>
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
            <h2 className="font-bold">Amazon দাম অটো আপডেট — কানেক্ট হয়নি</h2>
            <p className="mt-1 text-sm text-slate-600">দামের অটো আপডেট <strong>এখনো বানানো হয়নি</strong>, তুমি যেমন বলেছিলে। এটার জন্য Amazon Product Advertising API লাগবে, যেটা Amazon দেয় তোমার Associates অ্যাকাউন্টে বিক্রি হওয়ার পর। আপাতত দাম হাতে বদলাতে হবে, প্রোডাক্ট থেকে।</p>
            <p className="mt-2 text-sm">সেটিংসে Amazon API key: <strong>{settings?.amazonApiKey ? 'দেওয়া আছে' : 'দেওয়া নেই'}</strong></p>
            <button onClick={() => setMsg(settings?.amazonApiKey ? 'Amazon API এখনো কানেক্ট হয়নি — PA-API অনুমোদন না হওয়া পর্যন্ত অটো আপডেট বন্ধ থাকবে।' : 'Amazon API key দেওয়া নেই। সেটিংসে key না বসানো পর্যন্ত দাম আপডেট বন্ধ থাকবে।')} className="mt-3 rounded-full bg-navy px-5 py-2 text-sm font-bold text-white">দাম আপডেট করুন</button>
          </div>
        </div>
      )}

      {tab === 'visitors' && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
            <h2 className="font-bold">ভিজিটর রিপোর্ট — একটা জরুরি কথা</h2>
            <p className="mt-1 text-sm text-slate-600">এই ট্র্যাকার শুধু <strong>এই ডেপ্লয় থেকে</strong> গোনা শুরু করেছে — এর আগের ভিজিটরদের (আর Google Analytics-এর আগের ডেটাও) এখানে দেখা যাবে না। নাম, ফোন নম্বর বা ঠিকানা সংরক্ষণ করা হয় না — শুধু দেশ/শহর, ডিভাইস আর কোন পেজ দেখেছে সেটা থাকে।</p>
            <p className="mt-1 text-sm text-slate-600">Vercel-এ <code>data/db.json</code> স্থায়ী না — এই ডেটা হারিয়ে যাওয়ার আগেই <strong>এক্সপোর্ট / ইমপোর্ট ট্যাব থেকে JSON এক্সপোর্ট</strong> করে রাখুন।</p>
            <p className="mt-1 text-sm font-bold text-red-700">IP ঠিকানা শুধু অ্যাডমিন (আপনি) দেখতে পারবেন — এটা কারো সাথে শেয়ার করবেন না, কোথাও পাবলিশ করবেন না।</p>
          </div>
          {!stats ? (
            <p className="rounded-2xl border p-5 text-sm text-slate-500">রিপোর্ট লোড হচ্ছে…</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {[
                  ['মোট ভিজিটর', stats.totalVisitors],
                  ['আজকের ভিজিটর', stats.todayVisitors],
                  ['মোট পেজ ভিউ', stats.totalPageviews],
                  ['আজকের পেজ ভিউ', stats.todayPageviews],
                  ['মোট Buy ক্লিক', totalClicks],
                  ['ক্লিকের হার', `${ctr}%`],
                ].map(([label, v]) => (
                  <div key={label as string} className="rounded-2xl border p-5 text-center"><p className="text-3xl font-black text-navy">{v}</p><p className="text-sm text-slate-500">{label}</p></div>
                ))}
              </div>

              <div className="rounded-2xl border p-5">
                <h2 className="font-bold">শেষ ৭ দিন — পেজ ভিউ</h2>
                {stats.last7Days.every((d) => d.views === 0) ? (
                  <p className="mt-2 text-sm text-slate-500">শেষ ৭ দিনে এখনো কোনো ভিজিট রেকর্ড হয়নি — ডেপ্লয়ের পর সাইটে কেউ ঢুকলেই এখানে দেখাবে।</p>
                ) : (
                  <div className="mt-4 flex items-end gap-2" style={{ height: 140 }}>
                    {stats.last7Days.map((d) => (
                      <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                        <span className="text-xs font-bold">{d.views}</span>
                        <div className="w-full max-w-[48px] rounded-t-lg bg-brand" style={{ height: `${Math.max(4, (d.views / maxDayViews) * 100)}px` }} />
                        <span className="text-[11px] text-slate-500">{d.date.slice(5)}</span>
                        <span className="text-[11px] text-slate-400">{d.visitors} জন</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-5">
                  <h2 className="font-bold">সবচেয়ে দেখা পেজ</h2>
                  {stats.topPages.length === 0 ? <p className="mt-2 text-sm text-slate-500">এখনো কোনো ভিজিট হয়নি।</p> : (
                    <table className="mt-3 w-full text-sm"><tbody>{stats.topPages.map((p) => (<tr key={p.path} className="border-t"><td className="break-all py-2">{p.path}</td><td className="py-2 text-right font-bold">{p.views}</td></tr>))}</tbody></table>
                  )}
                </div>
                <div className="rounded-2xl border p-5">
                  <h2 className="font-bold">দেশ অনুযায়ী ভিজিটর</h2>
                  {stats.topCountries.length === 0 ? <p className="mt-2 text-sm text-slate-500">এখনো কোনো ভিজিট হয়নি।</p> : (
                    <table className="mt-3 w-full text-sm"><tbody>{stats.topCountries.map((c) => (<tr key={c.country} className="border-t"><td className="py-2">{c.country}</td><td className="py-2 text-right font-bold">{c.visitors} জন</td></tr>))}</tbody></table>
                  )}
                </div>
                <div className="rounded-2xl border p-5">
                  <h2 className="font-bold">ডিভাইস</h2>
                  {stats.deviceSplit.length === 0 ? <p className="mt-2 text-sm text-slate-500">এখনো কোনো ভিজিট হয়নি।</p> : (
                    <table className="mt-3 w-full text-sm"><tbody>{stats.deviceSplit.map((d) => (<tr key={d.device} className="border-t"><td className="py-2">{d.device === 'mobile' ? 'মোবাইল' : 'ডেস্কটপ'}</td><td className="py-2 text-right font-bold">{d.views}</td></tr>))}</tbody></table>
                  )}
                </div>
                <div className="rounded-2xl border p-5">
                  <h2 className="font-bold">কোথা থেকে এসেছে</h2>
                  {stats.topSources.length === 0 ? <p className="mt-2 text-sm text-slate-500">এখনো কোনো ভিজিট হয়নি।</p> : (
                    <table className="mt-3 w-full text-sm"><tbody>{stats.topSources.map((s) => (<tr key={s.source} className="border-t"><td className="py-2">{s.source === 'Direct' ? 'সরাসরি (Direct)' : s.source}</td><td className="py-2 text-right font-bold">{s.visitors} জন</td></tr>))}</tbody></table>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border p-5">
                <h2 className="font-bold">সাম্প্রতিক ভিজিটর — প্রতিজন কী দেখেছে, কী ক্লিক করেছে</h2>
                {visitorRows.length === 0 ? <p className="mt-2 text-sm text-slate-500">এখনো কোনো ভিজিটর নেই।</p> : (
                  <div className="mt-3 space-y-3">
                    {visitorRows.map((g, i) => {
                      const latest = g.latest;
                      const pages = [...new Set(g.visits.map((v) => v.path))];
                      return (
                        <div key={latest?.visitorId || i} className="rounded-xl border px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <span><strong>{latest?.country || 'Unknown'}</strong>{latest?.city && latest.city !== 'Unknown' ? `, ${latest.city}` : ''}</span>
                            <span className="font-mono text-xs">IP: {latest?.ip || 'Unknown'}</span>
                            <span>এসেছে: {latest?.source || 'Direct'}</span>
                            <span>ডিভাইস: {latest?.device === 'mobile' ? 'মোবাইল' : 'ডেস্কটপ'}</span>
                            <span className="text-slate-500">{latest ? new Date(latest.time).toLocaleString() : ''}</span>
                          </div>
                          <p className="mt-1"><strong>দেখা পেজ ({g.visits.length}):</strong> {pages.join(', ')}</p>
                          <p className="mt-1"><strong>Buy ক্লিক ({g.clicks.length}):</strong> {g.clicks.length === 0 ? 'কোনো ক্লিক হয়নি' : g.clicks.map((c) => c.productName).join(', ')}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border p-5">
                <h2 className="font-bold">সাম্প্রতিক ভিজিট (শেষ ২০টি পেজ ভিউ)</h2>
                {stats.recent.length === 0 ? <p className="mt-2 text-sm text-slate-500">এখনো কোনো ভিজিট হয়নি।</p> : (
                  <div className="overflow-x-auto"><table className="mt-3 w-full min-w-[560px] text-sm"><thead><tr className="text-left text-slate-500"><th className="py-2">সময়</th><th className="py-2">পেজ</th><th className="py-2">দেশ / শহর</th><th className="py-2">ডিভাইস</th><th className="py-2">এসেছে</th></tr></thead><tbody>{stats.recent.map((v) => (<tr key={v.id} className="border-t"><td className="py-2">{new Date(v.time).toLocaleString()}</td><td className="break-all py-2">{v.path}</td><td className="py-2">{v.country}{v.city && v.city !== 'Unknown' ? ` / ${v.city}` : ''}</td><td className="py-2">{v.device === 'mobile' ? 'মোবাইল' : 'ডেস্কটপ'}</td><td className="py-2">{v.source}</td></tr>))}</tbody></table></div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'products' && (
        <div className="mt-6">
          <button onClick={() => setEditing({ ...emptyProduct, id: `p${Date.now()}` })} className="rounded-full bg-brand px-5 py-2 font-bold text-white">+ প্রোডাক্ট যোগ করুন</button>
          {editing && (
            <form onSubmit={saveProduct} className="mt-4 grid gap-3 rounded-2xl border p-5 md:grid-cols-2">
              <input className={input} placeholder="প্রোডাক্টের নাম" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
              <input className={input} placeholder="Slug (যেমন wireless-headphones)" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              <select className={input} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>{categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
              <input className={input} placeholder="ASIN (e.g. B0CHX5Q2K7)" value={editing.asin} onChange={(e) => setEditing({ ...editing, asin: e.target.value })} />
              <input className={input} type="number" step="0.01" placeholder="দাম ($)" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              <input className={input} type="number" step="0.01" placeholder="পুরনো দাম ($)" value={editing.oldPrice} onChange={(e) => setEditing({ ...editing, oldPrice: Number(e.target.value) })} />
              <input className={input} type="number" step="0.1" placeholder="রেটিং (০–৫)" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
              <input className={input} type="number" placeholder="রিভিউ সংখ্যা" value={editing.reviews} onChange={(e) => setEditing({ ...editing, reviews: Number(e.target.value) })} />
              <input className={input} placeholder="ব্যাজ (যেমন Best Seller)" value={editing.badge || ''} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} />
              <input className={input} placeholder="ছবির লিংক (URL)" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              <input className={input} placeholder="Amazon প্রোডাক্টের লিংক" value={editing.amazonUrl} onChange={(e) => setEditing({ ...editing, amazonUrl: e.target.value })} />
              <input className={input} placeholder="দামের তারিখ (YYYY-MM-DD)" value={editing.priceAsOf} onChange={(e) => setEditing({ ...editing, priceAsOf: e.target.value })} />
              <textarea className={`${input} md:col-span-2`} placeholder="বিবরণ" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              <textarea className={`${input} md:col-span-2`} placeholder="হাইলাইট — প্রতি লাইনে একটা" value={editing.highlights.join('\n')} onChange={(e) => setEditing({ ...editing, highlights: e.target.value.split('\n').filter(Boolean) })} />
              <textarea className={`${input}`} placeholder="ভালো দিক — প্রতি লাইনে একটা" value={editing.pros.join('\n')} onChange={(e) => setEditing({ ...editing, pros: e.target.value.split('\n').filter(Boolean) })} />
              <textarea className={`${input}`} placeholder="খারাপ দিক — প্রতি লাইনে একটা" value={editing.cons.join('\n')} onChange={(e) => setEditing({ ...editing, cons: e.target.value.split('\n').filter(Boolean) })} />
              <div className="flex gap-2 md:col-span-2"><button className="rounded-full bg-navy px-6 py-2 font-bold text-white">প্রোডাক্ট সেভ করুন</button><button type="button" onClick={() => setEditing(null)} className="rounded-full border px-6 py-2 font-bold">বাতিল</button></div>
            </form>
          )}
          <div className="mt-4 space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3">
                <span><strong>{p.name}</strong> <span className="text-sm text-slate-500">· {p.category} · ${p.price.toFixed(2)} · ★{p.rating}</span></span>
                <span className="flex gap-2"><button onClick={() => setEditing(p)} className="rounded-full border px-3 py-1 text-sm font-bold">এডিট</button><button onClick={() => deleteProduct(p.id)} className="rounded-full border border-red-300 px-3 py-1 text-sm font-bold text-red-600">ডিলিট</button></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="mt-6">
          <button onClick={() => setEditingCat({ id: `c${Date.now()}`, slug: '', name: '', image: '', description: '' })} className="rounded-full bg-brand px-5 py-2 font-bold text-white">+ ক্যাটাগরি যোগ করুন</button>
          {editingCat && (
            <form onSubmit={async (e) => { e.preventDefault(); await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingCat) }); setEditingCat(null); load(); }} className="mt-4 grid gap-3 rounded-2xl border p-5">
              <input className={input} placeholder="প্রোডাক্টের নাম" value={editingCat.name} onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })} required />
              <input className={input} placeholder="Slug" value={editingCat.slug} onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })} />
              <input className={input} placeholder="ছবির লিংক (URL)" value={editingCat.image} onChange={(e) => setEditingCat({ ...editingCat, image: e.target.value })} />
              <input className={input} placeholder="বিবরণ" value={editingCat.description} onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })} />
              <button className="rounded-full bg-navy px-6 py-2 font-bold text-white">ক্যাটাগরি সেভ করুন</button>
            </form>
          )}
          <div className="mt-4 space-y-2">{categories.map((c) => (<div key={c.id} className="flex items-center justify-between rounded-xl border px-4 py-3"><span><strong>{c.name}</strong> <span className="text-sm text-slate-500">· /{c.slug}</span></span><span className="flex gap-2"><button onClick={() => setEditingCat(c)} className="rounded-full border px-3 py-1 text-sm font-bold">এডিট</button><button onClick={async () => { if (confirm('এই ক্যাটাগরিটা ডিলিট করবেন?')) { await fetch(`/api/categories?id=${c.id}`, { method: 'DELETE' }); load(); } }} className="rounded-full border border-red-300 px-3 py-1 text-sm font-bold text-red-600">ডিলিট</button></span></div>))}</div>
        </div>
      )}

      {tab === 'guides' && (
        <div className="mt-6">
          <button onClick={() => setEditingGuide({ id: `g${Date.now()}`, slug: '', title: '', excerpt: '', category: 'Electronics', date: new Date().toISOString().slice(0, 10), image: '', content: '' })} className="rounded-full bg-brand px-5 py-2 font-bold text-white">+ গাইড যোগ করুন</button>
          {editingGuide && (
            <form onSubmit={async (e) => { e.preventDefault(); await fetch('/api/guides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingGuide) }); setEditingGuide(null); load(); }} className="mt-4 grid gap-3 rounded-2xl border p-5">
              <input className={input} placeholder="শিরোনাম" value={editingGuide.title} onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })} required />
              <input className={input} placeholder="Slug" value={editingGuide.slug} onChange={(e) => setEditingGuide({ ...editingGuide, slug: e.target.value })} />
              <input className={input} placeholder="ছবির লিংক (URL)" value={editingGuide.image} onChange={(e) => setEditingGuide({ ...editingGuide, image: e.target.value })} />
              <textarea className={input} placeholder="সংক্ষেপ" value={editingGuide.excerpt} onChange={(e) => setEditingGuide({ ...editingGuide, excerpt: e.target.value })} />
              <textarea className={input} placeholder="পুরো লেখা" rows={6} value={editingGuide.content} onChange={(e) => setEditingGuide({ ...editingGuide, content: e.target.value })} />
              <button className="rounded-full bg-navy px-6 py-2 font-bold text-white">গাইড সেভ করুন</button>
            </form>
          )}
          <div className="mt-4 space-y-2">{guides.map((g) => (<div key={g.id} className="flex items-center justify-between rounded-xl border px-4 py-3"><span><strong>{g.title}</strong></span><span className="flex gap-2"><button onClick={() => setEditingGuide(g)} className="rounded-full border px-3 py-1 text-sm font-bold">এডিট</button><button onClick={async () => { if (confirm('এই গাইডটা ডিলিট করবেন?')) { await fetch(`/api/guides?id=${g.id}`, { method: 'DELETE' }); load(); } }} className="rounded-full border border-red-300 px-3 py-1 text-sm font-bold text-red-600">ডিলিট</button></span></div>))}</div>
        </div>
      )}

      {tab === 'settings' && settings && (
        <form onSubmit={saveSettings} className="mt-6 grid max-w-2xl gap-3">
          <label className="text-sm font-bold">সাইটের নাম<input className={input} value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} /></label>
          <label className="text-sm font-bold">ট্যাগলাইন<input className={input} value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} /></label>
          <label className="text-sm font-bold">Amazon Associate Tag<input className={input} value={settings.amazonTag} onChange={(e) => setSettings({ ...settings, amazonTag: e.target.value })} /></label>
          <label className="text-sm font-bold">হিরো শিরোনাম<input className={input} value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} /></label>
          <label className="text-sm font-bold">হিরো সাবটাইটেল<input className={input} value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} /></label>
          <label className="text-sm font-bold">হিরো ব্যাজ<input className={input} value={settings.heroBadge} onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })} /></label>
          <label className="text-sm font-bold">যোগাযোগের ইমেইল<input className={input} value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} /></label>
          <label className="text-sm font-bold">Amazon API key (ঐচ্ছিক — PA-API অনুমোদন না হওয়া পর্যন্ত ফাঁকা রাখুন)<input className={input} value={settings.amazonApiKey} onChange={(e) => setSettings({ ...settings, amazonApiKey: e.target.value })} placeholder="কানেক্ট হয়নি" /></label>
          <p className="rounded-lg bg-amber-50 p-3 text-sm">অ্যাডমিন পাসওয়ার্ড এখান থেকে বদলানো যাবে <strong>না</strong> — Vercel → Settings → Environment Variables-এ ADMIN_PASSWORD বসিয়ে আবার ডেপ্লয় করুন। ডিফল্ট পাসওয়ার্ড বদলে ফেলো, নইলে যে কেউ ঢুকে পড়তে পারে।</p>
          <button className="rounded-full bg-navy px-6 py-2.5 font-bold text-white">সেটিংস সেভ করুন</button>
        </form>
      )}

      {tab === 'subscribers' && (
        <div className="mt-6 rounded-2xl border p-5">
          <h2 className="font-bold">ডিল অ্যালার্ট সাবস্ক্রাইবার ({subs.length})</h2>
          {subs.length === 0 ? <p className="mt-2 text-sm text-slate-500">এখনো কেউ সাবস্ক্রাইব করেনি।</p> : (
            <div className="overflow-x-auto"><table className="mt-3 w-full min-w-[320px] text-sm"><thead><tr className="text-left text-slate-500"><th className="py-2">ইমেইল</th><th className="py-2 text-right">সাইনআপের তারিখ</th></tr></thead><tbody>{subs.map((s) => (<tr key={s.email} className="border-t"><td className="py-2">{s.email}</td><td className="py-2 text-right">{s.date}</td></tr>))}</tbody></table></div>
          )}
        </div>
      )}

      {tab === 'backup' && (
        <div className="mt-6 space-y-4 rounded-2xl border p-5">
          <h2 className="font-bold">এক্সপোর্ট / ইমপোর্ট JSON</h2>
          <p className="text-sm text-slate-600">Vercel-এ <code>data/db.json</code> স্থায়ী না — এই অ্যাডমিন প্যানেলে বদল করলে আবার ডেপ্লয় করলে সেটা হারিয়ে যেতে পারে। <strong>বদলের পর সবসময় এক্সপোর্ট করুন</strong>, ফাইলটা নিরাপদে রাখুন, তারপর আপডেট করা <code>data/db.json</code> GitHub-এ দিয়ে আবার ডেপ্লয় করুন। স্থায়ীভাবে রাখতে পরে Vercel Postgres বা KV লাগাতে হবে (README দেখুন)।</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportDb} className="rounded-full bg-navy px-5 py-2 font-bold text-white">JSON এক্সপোর্ট</button>
            <label className="cursor-pointer rounded-full border px-5 py-2 font-bold">JSON ইমপোর্ট<input type="file" accept=".json" className="hidden" onChange={importDb} /></label>
          </div>
        </div>
      )}
    </div>
  );
}
