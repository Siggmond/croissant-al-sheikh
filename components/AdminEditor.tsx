'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MenuItem, SiteContent } from '@/lib/types';
import { slugify } from '@/lib/format';

type AdminResponse = { ok: true; data: SiteContent; source?: string } | { ok: false; error: string };
type Tab = 'brand' | 'menu' | 'board' | 'branches' | 'reviews' | 'json';

const emptyItem = (categoryId: string): MenuItem => ({
  id: `item-${Date.now()}`,
  categoryId,
  name: 'New item',
  nameAr: '',
  description: '',
  price: 0,
  currency: 'LBP',
  badge: '',
  available: true,
  highlighted: false,
  image: '/media/classic-croissant.webp'
});

export function AdminEditor({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [tab, setTab] = useState<Tab>('menu');
  const [status, setStatus] = useState('Ready');
  const [jsonDraft, setJsonDraft] = useState(JSON.stringify(initialContent, null, 2));

  useEffect(() => {
    setJsonDraft(JSON.stringify(content, null, 2));
  }, [content]);

  const categories = useMemo(() => [...content.categories].sort((a, b) => a.order - b.order), [content.categories]);

  async function save() {
    setStatus('Saving to Vercel Edge Config...');
    try {
      const payload = tab === 'json' ? JSON.parse(jsonDraft) : content;
      const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const body = (await res.json()) as AdminResponse;
      if (!body.ok) throw new Error(body.error);
      setContent(body.data);
      setStatus(`Saved at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Save failed');
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  function updateItem(id: string, patch: Partial<MenuItem>) {
    setContent((current) => ({ ...current, menu: current.menu.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
  }

  return (
    <div className="admin-wrap">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Admin CMS</span>
            <h2>Menu and board control.</h2>
          </div>
          <div className="admin-actions">
            <a className="btn secondary" href="/" target="_blank">Website</a>
            <a className="btn secondary" href="/board" target="_blank">Board</a>
            <button className="btn" onClick={save}>Publish</button>
            <button className="btn secondary" onClick={logout}>Logout</button>
          </div>
        </div>
        <p className="status">{status}</p>
        <div className="admin-grid">
          <aside className="sidebar admin-card" aria-label="Admin sections">
            {(['menu', 'board', 'brand', 'branches', 'reviews', 'json'] as Tab[]).map((entry) => (
              <button className="admin-button" key={entry} onClick={() => setTab(entry)} aria-pressed={tab === entry}>{entry.toUpperCase()}</button>
            ))}
          </aside>
          <section className="admin-card">
            {tab === 'brand' ? (
              <div className="form-grid">
                <Field label="Brand name" value={content.brand.name} onChange={(value) => setContent({ ...content, brand: { ...content.brand, name: value } })} />
                <Field label="Arabic name" value={content.brand.nameAr} onChange={(value) => setContent({ ...content, brand: { ...content.brand, nameAr: value } })} />
                <Field label="Tagline" value={content.brand.tagline} onChange={(value) => setContent({ ...content, brand: { ...content.brand, tagline: value } })} />
                <Field label="Instagram handle" value={content.brand.instagram} onChange={(value) => setContent({ ...content, brand: { ...content.brand, instagram: value } })} />
                <Field label="Primary phone" value={content.brand.phonePrimary} onChange={(value) => setContent({ ...content, brand: { ...content.brand, phonePrimary: value } })} />
                <Field label="Secondary phone" value={content.brand.phoneSecondary || ''} onChange={(value) => setContent({ ...content, brand: { ...content.brand, phoneSecondary: value } })} />
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label>Price notice</label>
                  <textarea value={content.priceNotice} onChange={(event) => setContent({ ...content, priceNotice: event.target.value })} />
                </div>
              </div>
            ) : null}

            {tab === 'board' ? (
              <div className="form-grid">
                <Field label="Board headline" value={content.board.headline} onChange={(value) => setContent({ ...content, board: { ...content.board, headline: value } })} />
                <Field label="Board subheadline" value={content.board.subheadline} onChange={(value) => setContent({ ...content, board: { ...content.board, subheadline: value } })} />
                <Field label="Ticker" value={content.board.ticker} onChange={(value) => setContent({ ...content, board: { ...content.board, ticker: value } })} />
                <Field label="Refresh seconds" type="number" value={String(content.board.refreshSeconds)} onChange={(value) => setContent({ ...content, board: { ...content.board, refreshSeconds: Number(value) || 15 } })} />
                <div className="field"><label>Theme</label><select value={content.board.theme} onChange={(event) => setContent({ ...content, board: { ...content.board, theme: event.target.value as SiteContent['board']['theme'] } })}><option value="dark">Dark</option><option value="classic">Classic</option><option value="cream">Cream</option></select></div>
                <label className="field"><span>Show QR</span><input type="checkbox" checked={content.board.showQr} onChange={(event) => setContent({ ...content, board: { ...content.board, showQr: event.target.checked } })} /></label>
              </div>
            ) : null}

            {tab === 'menu' ? (
              <div>
                <div className="admin-actions">
                  <button className="btn brand" onClick={() => setContent((current) => ({ ...current, menu: [emptyItem(current.categories[0]?.id || 'classic'), ...current.menu] }))}>Add item</button>
                </div>
                <div className="editor-list">
                  {content.menu.map((item) => (
                    <div className="editor-item" key={item.id}>
                      <div className="form-grid">
                        <Field label="Name" value={item.name} onChange={(value) => updateItem(item.id, { name: value, id: item.id.startsWith('item-') ? slugify(value) || item.id : item.id })} />
                        <Field label="Arabic name" value={item.nameAr || ''} onChange={(value) => updateItem(item.id, { nameAr: value })} />
                        <div className="field"><label>Category</label><select value={item.categoryId} onChange={(event) => updateItem(item.id, { categoryId: event.target.value })}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
                        <Field label="Price" type="number" value={String(item.price)} onChange={(value) => updateItem(item.id, { price: Number(value) || 0 })} />
                        <Field label="Badge" value={item.badge || ''} onChange={(value) => updateItem(item.id, { badge: value })} />
                        <Field label="Image path" value={item.image || ''} onChange={(value) => updateItem(item.id, { image: value })} />
                        <div className="field" style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} /></div>
                        <label className="field"><span>Available</span><input type="checkbox" checked={item.available} onChange={(event) => updateItem(item.id, { available: event.target.checked })} /></label>
                        <label className="field"><span>Highlight on board</span><input type="checkbox" checked={!!item.highlighted} onChange={(event) => updateItem(item.id, { highlighted: event.target.checked })} /></label>
                      </div>
                      <div className="admin-actions">
                        <button className="btn secondary" onClick={() => setContent((current) => ({ ...current, menu: current.menu.filter((m) => m.id !== item.id) }))}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {tab === 'branches' ? (
              <div className="editor-list">
                {content.branches.map((branch) => (
                  <div className="editor-item" key={branch.id}>
                    <div className="form-grid">
                      <Field label="Name" value={branch.name} onChange={(value) => setContent((current) => ({ ...current, branches: current.branches.map((b) => b.id === branch.id ? { ...b, name: value } : b) }))} />
                      <Field label="Phone" value={branch.phone} onChange={(value) => setContent((current) => ({ ...current, branches: current.branches.map((b) => b.id === branch.id ? { ...b, phone: value } : b) }))} />
                      <Field label="Address" value={branch.address} onChange={(value) => setContent((current) => ({ ...current, branches: current.branches.map((b) => b.id === branch.id ? { ...b, address: value } : b) }))} />
                      <Field label="Opening hours" value={branch.openingHours} onChange={(value) => setContent((current) => ({ ...current, branches: current.branches.map((b) => b.id === branch.id ? { ...b, openingHours: value } : b) }))} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === 'reviews' ? (
              <div className="editor-list">
                {content.reviews.map((review) => (
                  <div className="editor-item" key={review.id}>
                    <div className="form-grid">
                      <Field label="Author" value={review.author} onChange={(value) => setContent((current) => ({ ...current, reviews: current.reviews.map((r) => r.id === review.id ? { ...r, author: value } : r) }))} />
                      <Field label="Rating" type="number" value={String(review.rating)} onChange={(value) => setContent((current) => ({ ...current, reviews: current.reviews.map((r) => r.id === review.id ? { ...r, rating: Number(value) || 5 } : r) }))} />
                      <div className="field" style={{ gridColumn: '1 / -1' }}><label>Text</label><textarea value={review.text} onChange={(event) => setContent((current) => ({ ...current, reviews: current.reviews.map((r) => r.id === review.id ? { ...r, text: event.target.value } : r) }))} /></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === 'json' ? (
              <div className="field">
                <label>Advanced JSON editor</label>
                <textarea value={jsonDraft} onChange={(event) => setJsonDraft(event.target.value)} style={{ minHeight: 620, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }} />
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
