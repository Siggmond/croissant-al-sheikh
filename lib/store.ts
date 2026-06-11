import { seedContent } from '@/data/seed';
import type { SiteContent } from '@/lib/types';
import { validateContent } from '@/lib/validate';

const EDGE_KEY = process.env.EDGE_CONFIG_KEY || 'croissant_site_content';

function teamQuery() {
  return process.env.EDGE_CONFIG_TEAM_ID ? `?teamId=${encodeURIComponent(process.env.EDGE_CONFIG_TEAM_ID)}` : '';
}

export async function loadContent(): Promise<{ data: SiteContent; source: string }> {
  const id = process.env.EDGE_CONFIG_ID;
  const token = process.env.EDGE_CONFIG_READ_TOKEN;

  if (!id || !token) {
    return { data: seedContent, source: 'seed' };
  }

  try {
    const res = await fetch(`https://edge-config.vercel.com/${id}/item/${EDGE_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (res.status === 404) return { data: seedContent, source: 'seed' };
    if (!res.ok) throw new Error(`Edge Config read failed: ${res.status}`);
    const body = (await res.json()) as SiteContent | null;
    return { data: body ? validateContent(body) : seedContent, source: 'edge-config' };
  } catch (error) {
    console.error(error);
    return { data: seedContent, source: 'seed-fallback' };
  }
}

export async function saveContent(content: SiteContent) {
  const token = process.env.VERCEL_API_TOKEN;
  const id = process.env.EDGE_CONFIG_ID;
  if (!token || !id) {
    throw new Error('Missing VERCEL_API_TOKEN or EDGE_CONFIG_ID. Configure Vercel Edge Config to persist admin edits.');
  }

  const validated = validateContent(content);
  const url = `https://api.vercel.com/v1/edge-config/${id}/items${teamQuery()}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [
        {
          operation: 'upsert',
          key: EDGE_KEY,
          value: validated
        }
      ]
    })
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Edge Config write failed: ${JSON.stringify(body)}`);
  return validated;
}
