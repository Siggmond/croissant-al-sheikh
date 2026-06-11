import { seedContent } from '../data/seed';

const token = process.env.VERCEL_API_TOKEN;
const edgeConfigId = process.env.EDGE_CONFIG_ID;
const teamId = process.env.EDGE_CONFIG_TEAM_ID;
const key = process.env.EDGE_CONFIG_KEY || 'croissant_site_content';

if (!token || !edgeConfigId) {
  console.error('Missing VERCEL_API_TOKEN or EDGE_CONFIG_ID');
  process.exit(1);
}

const url = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${teamId ? `?teamId=${encodeURIComponent(teamId)}` : ''}`;

const response = await fetch(url, {
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [{ operation: 'upsert', key, value: { ...seedContent, updatedAt: new Date().toISOString() } }]
  })
});

const body = await response.json().catch(() => ({}));
if (!response.ok) {
  console.error(body);
  process.exit(1);
}

console.log(`Seeded Edge Config key ${key}`);
