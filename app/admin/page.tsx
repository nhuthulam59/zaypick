'use client';
import { useEffect, useState } from 'react';
import type { Product, Category, Guide, Settings, Click, Subscriber, Db } from '@/lib/types';

type Tab = 'dashboard' | 'products' | 'categories' | 'guides' | 'settings' | 'subscribers' | 'backup';

const emptyProduct: Product = { id: '', slug: '', name: '', category: 'electronics', price: 0, oldPrice: 0, rating: 4.5, reviews: 0, badge: '', image: '', asin: '', description: '', highlights: [], pros: [], cons: [], amazonUrl: '', priceAsOf: new Date().toISOString().slice(0, 10) };

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);

  async function load() {
    const [p, c, g, s, k, u] = await Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/guides').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
      fetch('/api/clicks').then((r) => r.json()),
      fetch('/api/subscribers').then((r) => r.json()),
    ]);
    setProducts(p); setCategories(c); setGuides(g); setSettings(s); setClicks(k); setSubs(u);
  }
  useEffect(() => { load(); }, []);

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const r = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    if (r.ok) { setMsg('Product saved.'); setEditing(null); load(); } else setMsg('Could not save product.');
  }
  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    load();
  }
  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setMsg('Settings saved. Note: on Vercel, use Export JSON below to keep a durable copy.');
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
    setMsg(r.ok ? 'Database imported.' : 'Import failed — check the file is a ZayPick export.');
    load();
  }

  const totalClicks = clicks.reduce((s, c) => s + c.count, 0);
  const tabs: [Tab, string][] = [['dashboard', 'Dashboard'], ['products', 'Products'], ['categories', 'Categories'], ['guides', 'Guides'], ['settings', 'Settings'], ['subscribers', 'Subscribers'], ['backup', 'Export / Import']];
  const input = 'w-full rounded-lg border px-3 py-2';

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black text-navy">Admin — ZayPick</h1>
        <a href="/" className="text-sm font-bold text-brand">← View site</a>
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
            {[['Products', products.length], ['Categories', categories.length], ['Total Buy clicks', totalClicks], ['Subscribers', subs.length]].map(([label, v]) => (
              <div key={label as string} className="rounded-2xl border p-5 text-center"><p className="text-3xl font-black text-navy">{v}</p><p className="text-sm text-slate-500">{label}</p></div>
            ))}
          </div>
          <div className="rounded-2xl border p-5">
            <h2 className="font-bold">Click leaderboard — Buy on Amazon clicks per product</h2>
            {clicks.length === 0 ? <p className="mt-2 text-sm text-slate-500">No clicks yet.</p> : (
              <table className="mt-3 w-full text-sm"><tbody>{[...clicks].sort((a, b) => b.count - a.count).map((c) => (<tr key={c.productId} className="border-t"><td className="py-2">{c.productName}</td><td className="py-2 text-right font-bold">{c.count}</td></tr>))}</tbody></table>
            )}
          </div>
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
            <h2 className="font-bold">Amazon price auto-refresh — not connected</h2>
            <p className="mt-1 text-sm text-slate-600">Auto price update is <strong>not built yet</strong>, as you asked. It needs Amazon Product Advertising API access, which Amazon only gives after your Associates account has sales. For now, update prices by hand in Products.</p>
            <p className="mt-2 text-sm">Amazon API key in Settings: <strong>{settings?.amazonApiKey ? 'set' : 'not set'}</strong></p>
            <button onClick={() => setMsg(settings?.amazonApiKey ? 'Amazon API is not connected yet — auto-refresh is disabled until PA-API access is approved.' : 'No Amazon API key set. Refresh Prices is disabled until you add a key in Settings.')} className="mt-3 rounded-full bg-navy px-5 py-2 text-sm font-bold text-white">Refresh Prices</button>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="mt-6">
          <button onClick={() => setEditing({ ...emptyProduct, id: `p${Date.now()}` })} className="rounded-full bg-brand px-5 py-2 font-bold text-white">+ Add product</button>
          {editing && (
            <form onSubmit={saveProduct} className="mt-4 grid gap-3 rounded-2xl border p-5 md:grid-cols-2">
              <input className={input} placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
              <input className={input} placeholder="Slug (e.g. wireless-headphones)" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              <select className={input} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>{categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
              <input className={input} placeholder="ASIN (e.g. B0CHX5Q2K7)" value={editing.asin} onChange={(e) => setEditing({ ...editing, asin: e.target.value })} />
              <input className={input} type="number" step="0.01" placeholder="Price" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              <input className={input} type="number" step="0.01" placeholder="Old price" value={editing.oldPrice} onChange={(e) => setEditing({ ...editing, oldPrice: Number(e.target.value) })} />
              <input className={input} type="number" step="0.1" placeholder="Rating (0–5)" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
              <input className={input} type="number" placeholder="Review count" value={editing.reviews} onChange={(e) => setEditing({ ...editing, reviews: Number(e.target.value) })} />
              <input className={input} placeholder="Badge (e.g. Best Seller)" value={editing.badge || ''} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} />
              <input className={input} placeholder="Image URL" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              <input className={input} placeholder="Amazon product URL" value={editing.amazonUrl} onChange={(e) => setEditing({ ...editing, amazonUrl: e.target.value })} />
              <input className={input} placeholder="Price as of (YYYY-MM-DD)" value={editing.priceAsOf} onChange={(e) => setEditing({ ...editing, priceAsOf: e.target.value })} />
              <textarea className={`${input} md:col-span-2`} placeholder="Description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              <textarea className={`${input} md:col-span-2`} placeholder="Highlights — one per line" value={editing.highlights.join('\n')} onChange={(e) => setEditing({ ...editing, highlights: e.target.value.split('\n').filter(Boolean) })} />
              <textarea className={`${input}`} placeholder="Pros — one per line" value={editing.pros.join('\n')} onChange={(e) => setEditing({ ...editing, pros: e.target.value.split('\n').filter(Boolean) })} />
              <textarea className={`${input}`} placeholder="Cons — one per line" value={editing.cons.join('\n')} onChange={(e) => setEditing({ ...editing, cons: e.target.value.split('\n').filter(Boolean) })} />
              <div className="flex gap-2 md:col-span-2"><button className="rounded-full bg-navy px-6 py-2 font-bold text-white">Save product</button><button type="button" onClick={() => setEditing(null)} className="rounded-full border px-6 py-2 font-bold">Cancel</button></div>
            </form>
          )}
          <div className="mt-4 space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3">
                <span><strong>{p.name}</strong> <span className="text-sm text-slate-500">· {p.category} · ${p.price.toFixed(2)} · ★{p.rating}</span></span>
                <span className="flex gap-2"><button onClick={() => setEditing(p)} className="rounded-full border px-3 py-1 text-sm font-bold">Edit</button><button onClick={() => deleteProduct(p.id)} className="rounded-full border border-red-300 px-3 py-1 text-sm font-bold text-red-600">Delete</button></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="mt-6">
          <button onClick={() => setEditingCat({ id: `c${Date.now()}`, slug: '', name: '', image: '', description: '' })} className="rounded-full bg-brand px-5 py-2 font-bold text-white">+ Add category</button>
          {editingCat && (
            <form onSubmit={async (e) => { e.preventDefault(); await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingCat) }); setEditingCat(null); load(); }} className="mt-4 grid gap-3 rounded-2xl border p-5">
              <input className={input} placeholder="Name" value={editingCat.name} onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })} required />
              <input className={input} placeholder="Slug" value={editingCat.slug} onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })} />
              <input className={input} placeholder="Image URL" value={editingCat.image} onChange={(e) => setEditingCat({ ...editingCat, image: e.target.value })} />
              <input className={input} placeholder="Description" value={editingCat.description} onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })} />
              <button className="rounded-full bg-navy px-6 py-2 font-bold text-white">Save category</button>
            </form>
          )}
          <div className="mt-4 space-y-2">{categories.map((c) => (<div key={c.id} className="flex items-center justify-between rounded-xl border px-4 py-3"><span><strong>{c.name}</strong> <span className="text-sm text-slate-500">· /{c.slug}</span></span><span className="flex gap-2"><button onClick={() => setEditingCat(c)} className="rounded-full border px-3 py-1 text-sm font-bold">Edit</button><button onClick={async () => { if (confirm('Delete this category?')) { await fetch(`/api/categories?id=${c.id}`, { method: 'DELETE' }); load(); } }} className="rounded-full border border-red-300 px-3 py-1 text-sm font-bold text-red-600">Delete</button></span></div>))}</div>
        </div>
      )}

      {tab === 'guides' && (
        <div className="mt-6">
          <button onClick={() => setEditingGuide({ id: `g${Date.now()}`, slug: '', title: '', excerpt: '', category: 'Electronics', date: new Date().toISOString().slice(0, 10), image: '', content: '' })} className="rounded-full bg-brand px-5 py-2 font-bold text-white">+ Add guide</button>
          {editingGuide && (
            <form onSubmit={async (e) => { e.preventDefault(); await fetch('/api/guides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingGuide) }); setEditingGuide(null); load(); }} className="mt-4 grid gap-3 rounded-2xl border p-5">
              <input className={input} placeholder="Title" value={editingGuide.title} onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })} required />
              <input className={input} placeholder="Slug" value={editingGuide.slug} onChange={(e) => setEditingGuide({ ...editingGuide, slug: e.target.value })} />
              <input className={input} placeholder="Image URL" value={editingGuide.image} onChange={(e) => setEditingGuide({ ...editingGuide, image: e.target.value })} />
              <textarea className={input} placeholder="Excerpt" value={editingGuide.excerpt} onChange={(e) => setEditingGuide({ ...editingGuide, excerpt: e.target.value })} />
              <textarea className={input} placeholder="Full content" rows={6} value={editingGuide.content} onChange={(e) => setEditingGuide({ ...editingGuide, content: e.target.value })} />
              <button className="rounded-full bg-navy px-6 py-2 font-bold text-white">Save guide</button>
            </form>
          )}
          <div className="mt-4 space-y-2">{guides.map((g) => (<div key={g.id} className="flex items-center justify-between rounded-xl border px-4 py-3"><span><strong>{g.title}</strong></span><span className="flex gap-2"><button onClick={() => setEditingGuide(g)} className="rounded-full border px-3 py-1 text-sm font-bold">Edit</button><button onClick={async () => { if (confirm('Delete this guide?')) { await fetch(`/api/guides?id=${g.id}`, { method: 'DELETE' }); load(); } }} className="rounded-full border border-red-300 px-3 py-1 text-sm font-bold text-red-600">Delete</button></span></div>))}</div>
        </div>
      )}

      {tab === 'settings' && settings && (
        <form onSubmit={saveSettings} className="mt-6 grid max-w-2xl gap-3">
          <label className="text-sm font-bold">Site name<input className={input} value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} /></label>
          <label className="text-sm font-bold">Tagline<input className={input} value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} /></label>
          <label className="text-sm font-bold">Amazon Associate Tag<input className={input} value={settings.amazonTag} onChange={(e) => setSettings({ ...settings, amazonTag: e.target.value })} /></label>
          <label className="text-sm font-bold">Hero title<input className={input} value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} /></label>
          <label className="text-sm font-bold">Hero subtitle<input className={input} value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} /></label>
          <label className="text-sm font-bold">Hero badge<input className={input} value={settings.heroBadge} onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })} /></label>
          <label className="text-sm font-bold">Contact email<input className={input} value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} /></label>
          <label className="text-sm font-bold">Amazon API key (optional — leave blank until PA-API access is approved)<input className={input} value={settings.amazonApiKey} onChange={(e) => setSettings({ ...settings, amazonApiKey: e.target.value })} placeholder="Not connected" /></label>
          <p className="rounded-lg bg-amber-50 p-3 text-sm">Admin password is <strong>not</strong> changed here — set ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.</p>
          <button className="rounded-full bg-navy px-6 py-2.5 font-bold text-white">Save settings</button>
        </form>
      )}

      {tab === 'subscribers' && (
        <div className="mt-6 rounded-2xl border p-5">
          <h2 className="font-bold">Deal-alert subscribers ({subs.length})</h2>
          {subs.length === 0 ? <p className="mt-2 text-sm text-slate-500">No subscribers yet.</p> : (
            <table className="mt-3 w-full text-sm"><thead><tr className="text-left text-slate-500"><th className="py-2">Email</th><th className="py-2 text-right">Signup date</th></tr></thead><tbody>{subs.map((s) => (<tr key={s.email} className="border-t"><td className="py-2">{s.email}</td><td className="py-2 text-right">{s.date}</td></tr>))}</tbody></table>
          )}
        </div>
      )}

      {tab === 'backup' && (
        <div className="mt-6 space-y-4 rounded-2xl border p-5">
          <h2 className="font-bold">Export / Import JSON</h2>
          <p className="text-sm text-slate-600">On Vercel serverless hosting, <code>data/db.json</code> is per-instance — edits made in this admin panel may not survive a redeploy. <strong>Always export after changes</strong> and keep the file safe, then commit the updated <code>data/db.json</code> to GitHub before redeploying. For durable edits later, connect Vercel Postgres or KV (see README).</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportDb} className="rounded-full bg-navy px-5 py-2 font-bold text-white">Export JSON</button>
            <label className="cursor-pointer rounded-full border px-5 py-2 font-bold">Import JSON<input type="file" accept=".json" className="hidden" onChange={importDb} /></label>
          </div>
        </div>
      )}
    </div>
  );
}
