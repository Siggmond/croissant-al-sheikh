import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { loadContent, saveContent } from '@/lib/store';
import { validateContent } from '@/lib/validate';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const { data, source } = await loadContent();
    return NextResponse.json({ ok: true, data, source });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const content = validateContent(body);
    const saved = await saveContent(content);
    return NextResponse.json({ ok: true, data: saved, source: 'edge-config' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Save failed';
    const status = message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
