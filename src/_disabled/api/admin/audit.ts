/** GET /api/admin/audit?limit=50 — recent audit-log entries. */

import type { APIRoute } from 'astro';
import { auditRepo } from '~lib/db';
import { readSession } from '~lib/auth/session';
import { isAdmin } from '~lib/auth/policies';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, url }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 });
  }
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 200);
  const entries = await auditRepo.recent(limit);
  return new Response(JSON.stringify({ entries }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
