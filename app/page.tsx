import { Header } from '@/components/Header';
import { MenuCard } from '@/components/MenuCard';
import { ReviewCard } from '@/components/ReviewCard';
import { SimpleQr } from '@/components/Qr';
import { loadContent } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { data: content } = await loadContent();
  const availableMenu = content.menu.filter((item) => item.available);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

  return (
    <>
      <Header content={content} />
      <main>
        <section className="container hero">
          <div>
            <span className="eyebrow">🔥 Fresh from the oven • Take-away focused</span>
            <h1>Lebanon’s hot croissant stop, rebuilt for digital ordering.</h1>
            <p>{content.brand.tagline} This site is built with a live menu, admin-managed pricing, and a full-screen digital menu board for in-store screens.</p>
            <div className="hero-actions">
              <a className="btn brand" href="#menu">View menu</a>
              <a className="btn secondary" href="/board">Launch TV board</a>
            </div>
            <div className="metric-row">
              <div className="metric"><strong>2004</strong><span>Brand origin</span></div>
              <div className="metric"><strong>6+</strong><span>Lebanon branches mentioned on profile</span></div>
              <div className="metric"><strong>15s</strong><span>Default board refresh</span></div>
            </div>
          </div>
          <div className="hero-grid" aria-label="Croissant gallery preview">
            <div className="hero-card tall"><img src="/media/hand-croissant.webp" alt="Fresh croissant held by hand" /></div>
            <div className="hero-card"><img src="/media/fresh-stack.webp" alt="Fresh croissants on tray" /></div>
            <div className="hero-card"><img src="/media/chocolate-drizzle.webp" alt="Chocolate drizzle croissant" /></div>
          </div>
        </section>

        <section className="container section" id="menu">
          <div className="section-head">
            <div>
              <span className="eyebrow">Menu CMS</span>
              <h2>Fast menu updates for web and TV screens.</h2>
            </div>
            <p>Every item below is served from the same content API used by the digital menu board. Change a price once in admin, and the website plus screens pick it up on refresh.</p>
          </div>
          <div className="notice">{content.priceNotice}</div>
          <div className="category-tabs" aria-label="Menu categories">
            {content.categories.sort((a, b) => a.order - b.order).map((category) => (
              <a className="pill" href={`#cat-${category.id}`} key={category.id}>{category.name}</a>
            ))}
          </div>
          {content.categories.sort((a, b) => a.order - b.order).map((category) => {
            const items = availableMenu.filter((item) => item.categoryId === category.id);
            if (!items.length) return null;
            return (
              <div key={category.id} id={`cat-${category.id}`} style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 30, letterSpacing: '-0.04em' }}>{category.name} <span lang="ar" dir="rtl" style={{ color: 'var(--brand-2)' }}>{category.nameAr}</span></h3>
                <div className="menu-grid">
                  {items.map((item) => <MenuCard key={item.id} item={item} />)}
                </div>
              </div>
            );
          })}
        </section>

        <section className="container section" id="reviews">
          <div className="section-head">
            <div>
              <span className="eyebrow">Google review copy</span>
              <h2>What customers already say.</h2>
            </div>
            <p>The site highlights strong social proof but keeps quality-control signals visible for the owner in admin content.</p>
          </div>
          <div className="split">
            <div className="branch-card" id="branches">
              <span className="eyebrow" style={{ background: 'rgba(255,255,255,.12)', color: '#ffd79c' }}>Branches</span>
              <h2 style={{ marginTop: 14 }}>Grab it hot. Take it to go.</h2>
              <p>Use this block for official branch addresses, delivery numbers, and branch-specific opening hours.</p>
              {content.branches.map((branch) => (
                <div className="branch" key={branch.id}>
                  <strong>{branch.name}</strong>
                  <small>{branch.address}</small>
                  <small>{branch.phone} • {branch.openingHours}</small>
                </div>
              ))}
              <div className="qr-row">
                {content.board.showQr ? <SimpleQr value={siteUrl} /> : null}
                <div><strong>Scan for menu</strong><p style={{ margin: '6px 0 0' }}>{content.brand.instagram}</p></div>
              </div>
            </div>
            <div className="review-list">
              {content.reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
            </div>
          </div>
        </section>

        <section className="container section" id="gallery">
          <div className="section-head">
            <div>
              <span className="eyebrow">Instagram assets</span>
              <h2>Brand-ready visuals included.</h2>
            </div>
            <p>Optimized WebP images from the uploaded brand archive are bundled locally under public/media for Vercel image delivery.</p>
          </div>
          <div className="gallery">
            {content.gallery.map((image, index) => (
              <figure key={image}><img src={image} alt={`Croissant Al Sheikh gallery image ${index + 1}`} loading="lazy" /></figure>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h2>{content.brand.name}</h2>
            <p>{content.brand.tagline}</p>
          </div>
          <div><strong>Order</strong><p>{content.brand.phonePrimary}<br />{content.brand.phoneSecondary}</p></div>
          <div><strong>Digital board</strong><p><a href="/board">/board</a><br /><a href="/admin">/admin</a></p></div>
          <div><strong>Instagram</strong><p>@{content.brand.instagram}</p></div>
        </div>
      </footer>
    </>
  );
}
