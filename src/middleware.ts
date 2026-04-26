/**
 * Site-wide middleware. Three jobs:
 *
 * 1. **Security headers** — CSP, HSTS, X-Frame, nosniff, Permissions-Policy.
 *    Note: Astro middleware runs only for SSR routes; the server.mjs
 *    wrapper re-applies the same headers on prerendered HTML so the local
 *    self-hosted server is launch-grade. Vercel/Netlify use their own
 *    config files for the same purpose.
 *
 * 2. **Auth gate** — protects /admin/* (excluding /admin/login) and
 *    /api/admin/* by checking the session cookie. Unauthenticated requests
 *    redirect to /admin/login (HTML) or return 401 JSON (API).
 *
 * 3. **Per-IP rate limit** — token bucket on /api/* (20 req/60s).
 */

import { defineMiddleware } from 'astro:middleware';
import { readSession } from '~lib/auth/session';
import { isAdmin } from '~lib/auth/policies';

const isProd = import.meta.env.PROD;

const csp = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com",
  "frame-src https://www.openstreetmap.org https://api.razorpay.com https://checkout.razorpay.com",
  "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  isProd ? 'upgrade-insecure-requests' : '',
]
  .filter(Boolean)
  .join('; ');

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': csp,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(self "https://checkout.razorpay.com")',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// ────────── rate limiter ──────────
interface Bucket { tokens: number; resetAt: number }
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const buckets = new Map<string, Bucket>();

function rateCheck(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { tokens: RATE_MAX - 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.tokens <= 0) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.tokens--;
  return { ok: true, retryAfter: 0 };
}

if (typeof setInterval === 'function') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key);
    }
  }, RATE_WINDOW_MS).unref?.();
}

// ────────── auth gate ──────────
function requiresAuth(pathname: string): boolean {
  if (pathname.startsWith('/api/admin/')) return true;
  if (pathname === '/admin/login' || pathname === '/admin/login/') return false;
  if (pathname.startsWith('/admin')) return true;
  return false;
}

function isHtmlPath(pathname: string): boolean {
  return !pathname.startsWith('/api/');
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  const url = new URL(ctx.request.url);

  // 1. Auth gate — short-circuits before any handler runs.
  if (requiresAuth(url.pathname)) {
    const session = await readSession(ctx.cookies);
    if (!isAdmin(session)) {
      if (isHtmlPath(url.pathname)) {
        const nextParam = encodeURIComponent(url.pathname + url.search);
        return new Response(null, {
          status: 302,
          headers: { location: `/admin/login?next=${nextParam}`, ...SECURITY_HEADERS },
        });
      }
      return new Response(JSON.stringify({ error: 'unauthenticated' }), {
        status: 401,
        headers: { 'content-type': 'application/json', ...SECURITY_HEADERS },
      });
    }
  }

  // 2. Rate limit on /api/*.
  if (url.pathname.startsWith('/api/')) {
    const ip =
      ctx.request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      ctx.request.headers.get('x-real-ip') ||
      ctx.clientAddress ||
      'unknown';
    const { ok, retryAfter } = rateCheck(`${ip}:${url.pathname}`);
    if (!ok) {
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter }), {
        status: 429,
        headers: {
          'content-type': 'application/json',
          'retry-after': String(retryAfter),
          ...SECURITY_HEADERS,
        },
      });
    }
  }

  const response = await next();
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(k, v);
  }
  return response;
});
