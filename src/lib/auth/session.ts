/**
 * Cookie-backed session.
 *
 * Sessions are signed-encrypted blobs (iron-session sealData), set as an
 * httpOnly + sameSite=lax cookie. No separate session store needed —
 * scales horizontally, expires at the cookie's max-age.
 *
 * Production requires SESSION_SECRET (32+ chars). In dev we fall back to
 * a stable but loud-warning placeholder so the server still boots.
 */

import { sealData, unsealData } from 'iron-session';
import type { AstroCookies } from 'astro';

const COOKIE = 'mmbgims_session';
const TTL_SECONDS = 60 * 60 * 8; // 8 hours

const DEV_FALLBACK = 'dev-only-insecure-secret-please-set-SESSION_SECRET-in-prod';

function secret(): string {
  const raw = process.env.SESSION_SECRET;
  if (!raw || raw.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET must be set to a 32+ char value in production');
    }
    if (!process.env._MMBGIMS_DEV_SECRET_WARNED) {
      // eslint-disable-next-line no-console
      console.warn(
        '[auth] SESSION_SECRET unset or <32 chars — using dev fallback. Do not deploy like this.',
      );
      process.env._MMBGIMS_DEV_SECRET_WARNED = '1';
    }
    return DEV_FALLBACK;
  }
  return raw;
}

export interface SessionPayload {
  userId: number;
  email: string;
  role: 'Director' | 'Staff';
  /** issued-at, ms epoch, used for invalidation. */
  iat: number;
}

export async function encodeSession(payload: SessionPayload): Promise<string> {
  return sealData(payload, { password: secret(), ttl: TTL_SECONDS });
}

export async function decodeSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const data = (await unsealData(token, {
      password: secret(),
      ttl: TTL_SECONDS,
    })) as Partial<SessionPayload> | undefined;
    if (!data || typeof data.userId !== 'number') return null;
    return data as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(cookies: AstroCookies, payload: SessionPayload) {
  const sealed = await encodeSession(payload);
  cookies.set(COOKIE, sealed, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TTL_SECONDS,
  });
}

export function clearSessionCookie(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
}

export async function readSession(cookies: AstroCookies): Promise<SessionPayload | null> {
  const token = cookies.get(COOKIE)?.value;
  return decodeSession(token);
}

export const SESSION_COOKIE_NAME = COOKIE;
