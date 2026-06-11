import { NextResponse } from 'next/server';
import { assertAdminPassword, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    if (!password || !assertAdminPassword(password)) {
      return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
    }
    await setSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Login failed' }, { status: 500 });
  }
}
