import { BoardClient } from '@/components/BoardClient';
import { loadContent } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function BoardPage() {
  const { data } = await loadContent();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  return <BoardClient initialContent={data} siteUrl={siteUrl} />;
}
