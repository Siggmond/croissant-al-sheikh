'use client';

import { useState } from 'react';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('Checking...');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const body = await res.json();
    if (body.ok) window.location.href = '/admin';
    else setStatus(body.error || 'Login failed');
  }

  return (
    <main className="login">
      <form className="admin-card" onSubmit={submit}>
        <span className="eyebrow">Private CMS</span>
        <h1 style={{ fontSize: 44, letterSpacing: '-0.06em', margin: '16px 0' }}>Admin login</h1>
        <p style={{ color: 'var(--muted)', lineHeight: 1.5 }}>Use the password from Vercel environment variable ADMIN_PASSWORD.</p>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
        </div>
        <div className="admin-actions">
          <button className="btn brand" type="submit">Login</button>
          <a className="btn secondary" href="/">Back</a>
        </div>
        <p className="status">{status}</p>
      </form>
    </main>
  );
}
