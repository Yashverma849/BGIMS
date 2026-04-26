import { d as defineMiddleware, s as sequence } from './chunks/index_DRwaLtUn.mjs';
import { r as readSession } from './chunks/session_Dk9yDJEf.mjs';
import { i as isAdmin } from './chunks/policies_CgyPR65B.mjs';
import './chunks/astro-designed-error-pages_D3U2EJ8G.mjs';

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
  "upgrade-insecure-requests" 
].filter(Boolean).join("; ");
const SECURITY_HEADERS = {
  "Content-Security-Policy": csp,
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": 'geolocation=(), microphone=(), camera=(), payment=(self "https://checkout.razorpay.com")',
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
};
const RATE_WINDOW_MS = 6e4;
const RATE_MAX = 20;
const buckets = /* @__PURE__ */ new Map();
function rateCheck(key) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { tokens: RATE_MAX - 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.tokens <= 0) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1e3) };
  }
  bucket.tokens--;
  return { ok: true, retryAfter: 0 };
}
if (typeof setInterval === "function") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key);
    }
  }, RATE_WINDOW_MS).unref?.();
}
function requiresAuth(pathname) {
  if (pathname.startsWith("/api/admin/")) return true;
  if (pathname === "/admin/login" || pathname === "/admin/login/") return false;
  if (pathname.startsWith("/admin")) return true;
  return false;
}
function isHtmlPath(pathname) {
  return !pathname.startsWith("/api/");
}
const onRequest$1 = defineMiddleware(async (ctx, next) => {
  const url = new URL(ctx.request.url);
  if (requiresAuth(url.pathname)) {
    const session = await readSession(ctx.cookies);
    if (!isAdmin(session)) {
      if (isHtmlPath(url.pathname)) {
        const nextParam = encodeURIComponent(url.pathname + url.search);
        return new Response(null, {
          status: 302,
          headers: { location: `/admin/login?next=${nextParam}`, ...SECURITY_HEADERS }
        });
      }
      return new Response(JSON.stringify({ error: "unauthenticated" }), {
        status: 401,
        headers: { "content-type": "application/json", ...SECURITY_HEADERS }
      });
    }
  }
  if (url.pathname.startsWith("/api/")) {
    const ip = ctx.request.headers.get("x-forwarded-for")?.split(",")[0].trim() || ctx.request.headers.get("x-real-ip") || ctx.clientAddress || "unknown";
    const { ok, retryAfter } = rateCheck(`${ip}:${url.pathname}`);
    if (!ok) {
      return new Response(JSON.stringify({ error: "rate_limited", retryAfter }), {
        status: 429,
        headers: {
          "content-type": "application/json",
          "retry-after": String(retryAfter),
          ...SECURITY_HEADERS
        }
      });
    }
  }
  const response = await next();
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(k, v);
  }
  return response;
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
