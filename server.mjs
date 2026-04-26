/**
 * Production HTTP server for the self-hosted Node deployment.
 *
 * Composes:
 *   1. global security headers (CSP, HSTS, X-Frame-Options, …)
 *   2. long-lived cache-control on hashed /_astro/* asset bundles
 *   3. a tiny static file handler for the prerendered dist/client/* tree
 *   4. the Astro middleware-mode handler for SSR routes (/api/*, 404, …)
 *
 * For Vercel / Netlify / Cloudflare deployments, swap the adapter in
 * astro.config.mjs and rely on the platform's headers config — this file
 * is only needed for self-hosted Node.
 *
 *   PORT=4321 HOST=0.0.0.0 node server.mjs
 */

import { handler as astroHandler } from './dist/server/entry.mjs';
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = process.env.HOST ?? '0.0.0.0';
const PORT = Number(process.env.PORT ?? 4321);
const CLIENT_DIR = fileURLToPath(new URL('./dist/client/', import.meta.url));

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
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = {
  'Content-Security-Policy': csp,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

function tryStatic(req, res) {
  const url = (req.url ?? '/').split('?')[0];
  // Resolve and confine to CLIENT_DIR — defence against path traversal.
  const candidates = [];
  if (url === '/' || url === '') {
    candidates.push(join(CLIENT_DIR, 'index.html'));
  } else {
    const normalised = normalize(url).replace(/^[/\\]+/, '');
    if (normalised.includes('..')) return false;
    candidates.push(join(CLIENT_DIR, normalised));
    if (!extname(normalised)) {
      candidates.push(join(CLIENT_DIR, normalised, 'index.html'));
    }
  }
  for (const filepath of candidates) {
    try {
      const stat = statSync(filepath);
      if (!stat.isFile()) continue;
      const ext = extname(filepath).toLowerCase();
      res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
      res.setHeader('Content-Length', stat.size);
      res.statusCode = 200;
      createReadStream(filepath).pipe(res);
      return true;
    } catch {
      // try next candidate
    }
  }
  return false;
}

const server = createServer((req, res) => {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
  if (req.url?.startsWith('/_astro/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url?.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store');
  }

  // /api/*, 404, and any other SSR routes go through Astro.
  // /_astro/*, /img/*, robots.txt, sitemap-*.xml, favicon.svg, og.svg, and
  // the prerendered HTML pages are served directly from disk.
  const url = req.url ?? '/';
  if (url.startsWith('/api/')) {
    return astroHandler(req, res);
  }
  if (tryStatic(req, res)) return;
  return astroHandler(req, res);
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`MM BGIMS production server listening on http://${HOST}:${PORT}`);
});

const shutdown = (signal) => {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received, draining...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
