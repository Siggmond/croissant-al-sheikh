import type { SiteContent } from '@/lib/types';

export function Header({ content }: { content: SiteContent }) {
  return (
    <header className="header">
      <nav className="container nav" aria-label="Primary navigation">
        <a className="logo" href="/" aria-label="Home">
          <span className="logo-mark">🥐</span>
          <span>
            {content.brand.name}
            <small>{content.brand.nameAr} • Since {content.brand.since}</small>
          </span>
        </a>
        <div className="nav-links">
          <a href="#menu">Menu</a>
          <a href="#reviews">Reviews</a>
          <a href="#branches">Branches</a>
          <a href="#gallery">Gallery</a>
        </div>
        <div className="nav-actions">
          <a className="btn secondary" href="/board">Open board</a>
          <a className="btn brand" href={`tel:${content.brand.phonePrimary.replace(/\s/g, '')}`}>Call now</a>
        </div>
      </nav>
    </header>
  );
}
