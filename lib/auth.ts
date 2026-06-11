import { cookies } from 'next/headers';
import crypto from 'node:crypto';

const COOKIE_NAME = 'cas_admin';
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error('AUTH_SECRET must be set to a random value with at least 24 characters');
  }
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function createSessionToken() {
  const payload = JSON.stringify({ role: 'admin', exp: Math.floor(Date.now() / 1000) + ONE_WEEK_SECONDS });
  const encoded = Buffer.from(payload).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token?: string) {
  if (!token) return false;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as { exp?: number; role?: string };
  return payload.role === 'admin' && typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000);
}

export async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) throw new Error('Unauthorized');
}

export async function setSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ONE_WEEK_SECONDS,
    path: '/'
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 0, path: '/' });
}

export function assertAdminPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || configured === 'change-this-long-password') {
    throw new Error('ADMIN_PASSWORD is not configured');
  }
  const a = Buffer.from(password);
  const b = Buffer.from(configured);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
