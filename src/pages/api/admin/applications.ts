/**
 * Admin endpoints for applications.
 *
 *   GET  /api/admin/applications?programme=&status=&limit=
 *     → { applications, stats }
 *   PATCH /api/admin/applications/<id>
 *     (status update; not implemented as a route param here, but the same
 *      handler accepts ?id=&status= for simplicity in the dashboard.)
 */

import type { APIRoute } from 'astro';
import { applicationsRepo, auditRepo } from '~lib/db';
import { readSession } from '~lib/auth/session';
import { isAdmin } from '~lib/auth/policies';
import { ApplicationStatusSchema, ProgrammeIdSchema } from '~lib/schema';

export const prerender = false;

function unauthorised() {
  return new Response(JSON.stringify({ error: 'unauthenticated' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ cookies, url }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) return unauthorised();

  const programme = url.searchParams.get('programme');
  const status = url.searchParams.get('status');
  const limit = Number(url.searchParams.get('limit') ?? 1000);

  const filterProg = programme && ProgrammeIdSchema.safeParse(programme).success
    ? (programme as never)
    : undefined;
  const filterStatus = status && ApplicationStatusSchema.safeParse(status).success
    ? (status as never)
    : undefined;

  const [applications, stats] = await Promise.all([
    applicationsRepo.list({ programme: filterProg, status: filterStatus, limit }),
    applicationsRepo.stats(),
  ]);

  return new Response(JSON.stringify({ applications, stats }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};

export const PATCH: APIRoute = async ({ cookies, request, url, clientAddress }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) return unauthorised();

  const id = url.searchParams.get('id');
  const body = await request.json().catch(() => null);
  const status = ApplicationStatusSchema.safeParse(body?.status);
  if (!id || !status.success) {
    return new Response(JSON.stringify({ error: 'invalid_input' }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
  }
  await applicationsRepo.setStatus(id, status.data);
  await auditRepo.record({
    actorId: session!.userId,
    actorEmail: session!.email,
    action: 'application.status_changed',
    targetType: 'application',
    targetId: id,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get('user-agent') ?? null,
    metadata: { status: status.data },
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
