import type { MenuItem } from '@/lib/types';
import { formatMoney } from '@/lib/format';

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article className={`menu-card ${item.highlighted ? 'highlighted' : ''}`}>
      {item.image ? (
        <div className="menu-img">
          <img src={item.image} alt={`${item.name} product photo`} loading="lazy" />
        </div>
      ) : null}
      <h3>{item.name}</h3>
      {item.nameAr ? <div className="arabic" lang="ar" dir="rtl">{item.nameAr}</div> : null}
      <p>{item.description}</p>
      <div className="price-row">
        <span className="price">{formatMoney(item.price, item.currency)}</span>
        {item.badge ? <span className={`badge ${item.price === 0 ? 'warn' : ''}`}>{item.badge}</span> : null}
      </div>
    </article>
  );
}
