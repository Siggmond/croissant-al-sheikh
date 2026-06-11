import { NextResponse } from 'next/server';
import { loadContent } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, source } = await loadContent();
  return NextResponse.json({ ok: true, data, source }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Source': source
    }
  });
}
