/**
 * Site-wide middleware.
 *
 * Two responsibilities:
 *
 * 1. **Security headers** — applied to every response. Content Security
 *    Policy is permissive enough for the institute's current needs (Google
 *    Fonts, OpenStreetMap embed, Razorpay checkout) but tight enough to
 *    block common XSS / clickjacking vectors.
 *
 * 2. **Lightweight rate limiting** — only applied to /api/* routes. An
 *    in-memory token bucket per remote address is sufficient for a static
 *    site; for serious abuse, sit a real edge limiter (Cloudflare Turnstile,
 *    Vercel firewall) in front.
 */

import { defineMiddleware } from 'astro:middleware';

const isProd = import.meta.env.PROD;

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' on style-src is required because we set inline `style=""`
  // attributes on a few elements (year-on-year ladder bar widths, etc).
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  // 'unsafe-inline' on script-src for inline JSON-LD; Astro hashes other
  // hoisted scripts so they're already self-hosted.
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

// ───────── rate limiter ─────────
interface Bucket {
  tokens: number;
  resetAt: number;
}
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

// Periodically purge stale buckets so memory stays bounded under traffic.
if (typeof setInterval === 'function') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key);
    }
  }, RATE_WINDOW_MS).unref?.();
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  const response = await next();
  const url = new URL(ctx.request.url);

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

  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(k, v);
  }
  return response;
});
