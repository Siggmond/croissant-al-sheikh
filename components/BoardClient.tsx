'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SiteContent } from '@/lib/types';
import { formatMoney } from '@/lib/format';
import { SimpleQr } from '@/components/Qr';

type PublicResponse = { ok: true; data: SiteContent; source?: string } | { ok: false; error: string };

export function BoardClient({ initialContent, siteUrl }: { initialContent: SiteContent; siteUrl: string }) {
  const [content, setContent] = useState(initialContent);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const refresh = async () => {
      try {
        const response = await fetch('/api/content', { cache: 'no-store' });
        const body = (await response.json()) as PublicResponse;
        if (body.ok) setContent(body.data);
      } catch (error) {
        console.error(error);
      }
    };
    const interval = window.setInterval(refresh, Math.max(5, content.board.refreshSeconds) * 1000);
    return () => window.clearInterval(interval);
  }, [content.board.refreshSeconds]);

  const grouped = useMemo(() => {
    const highlighted = content.menu.filter((item) => item.available && item.highlighted).slice(0, 6);
    const other = content.menu.filter((item) => item.available && !item.highlighted).slice(0, 8);
    return { highlighted, other };
  }, [content.menu]);

  return (
    <main className="board-shell">
      <section className="board">
        <header className="board-header">
          <div className="board-brand">
            <div className="board-logo">🥐</div>
            <div>
              <h1>{content.board.headline}</h1>
              <p className="board-subtitle">{content.board.subheadline}</p>
            </div>
          </div>
          <div className="board-meta">
            <div className="board-time">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="board-arabic">{content.brand.nameAr}</div>
          </div>
        </header>

        <div className="board-menu">
          <div className="board-panel">
            <h2>Hot picks</h2>
            {grouped.highlighted.map((item) => (
              <div className="board-item" key={item.id}>
                {item.image ? <img src={item.image} alt="" /> : <div />}
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.nameAr} {item.badge ? `• ${item.badge}` : ''}</p>
                </div>
                <div className="board-price">{formatMoney(item.price, item.currency)}</div>
              </div>
            ))}
          </div>
          <div className="board-panel">
            <h2>More today</h2>
            {grouped.other.map((item) => (
              <div className="board-item" key={item.id}>
                {item.image ? <img src={item.image} alt="" /> : <div />}
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.nameAr} {item.badge ? `• ${item.badge}` : ''}</p>
                </div>
                <div className="board-price">{formatMoney(item.price, item.currency)}</div>
              </div>
            ))}
          </div>
        </div>

        <footer className="board-header board-footer">
          <div className="ticker" aria-live="polite"><span>{content.board.ticker} • Call {content.brand.phonePrimary} • @{content.brand.instagram}</span></div>
          {content.board.showQr ? <SimpleQr value={siteUrl} /> : null}
        </footer>
      </section>
    </main>
  );
}
