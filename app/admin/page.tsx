import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminEditor } from '@/components/AdminEditor';
import { verifySessionToken } from '@/lib/auth';
import { loadContent } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const jar = await cookies();
  if (!verifySessionToken(jar.get('cas_admin')?.value)) redirect('/admin/login');
  const { data } = await loadContent();
  return <AdminEditor initialContent={data} />;
}
