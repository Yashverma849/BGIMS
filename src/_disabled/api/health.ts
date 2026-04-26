/**
 * GET /api/health — for uptime monitoring and load-balancer probes.
 * Returns 200 with a small JSON body. Intentionally minimal so the check is
 * cheap and never depends on downstream services (DB, payment gateway).
 */

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.MMBGIMS_VERSION ?? 'dev',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    },
  );
};
