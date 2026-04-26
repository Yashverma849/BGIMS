import type { APIRoute } from 'astro';
import { enquiriesRepo, auditRepo } from '~lib/db';
import { readSession } from '~lib/auth/session';
import { isAdmin } from '~lib/auth/policies';

export const prerender = false;

function unauthorised() {
  return new Response(JSON.stringify({ error: 'unauthenticated' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ cookies }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) return unauthorised();
  const enquiries = await enquiriesRepo.list();
  return new Response(JSON.stringify({ enquiries }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};

export const PATCH: APIRoute = async ({ cookies, request, url, clientAddress }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) return unauthorised();
  const id = url.searchParams.get('id');
  const body = await request.json().catch(() => null);
  const status = body?.status as 'new' | 'contacted' | 'closed';
  if (!id || !['new', 'contacted', 'closed'].includes(status)) {
    return new Response(JSON.stringify({ error: 'invalid_input' }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
  }
  await enquiriesRepo.setStatus(id, status);
  await auditRepo.record({
    actorId: session!.userId,
    actorEmail: session!.email,
    action: 'enquiry.status_changed',
    targetType: 'enquiry',
    targetId: id,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get('user-agent') ?? null,
    metadata: { status },
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
