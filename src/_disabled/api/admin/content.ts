/**
 * GET  /api/admin/content?key=home_hero
 * PUT  /api/admin/content?key=home_hero  body: { eyebrow, h1, lede }
 */

import type { APIRoute } from 'astro';
import { contentRepo, auditRepo } from '~lib/db';
import { readSession } from '~lib/auth/session';
import { isAdmin } from '~lib/auth/policies';
import { ContentDraftSchema } from '~lib/schema';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, url }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 });
  }
  const key = url.searchParams.get('key');
  if (!key) {
    return new Response(JSON.stringify({ error: 'missing key' }), { status: 422 });
  }
  const draft = await contentRepo.get(key);
  return new Response(JSON.stringify({ draft }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};

export const PUT: APIRoute = async ({ cookies, url, request, clientAddress }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), { status: 401 });
  }
  const key = url.searchParams.get('key');
  if (!key) {
    return new Response(JSON.stringify({ error: 'missing key' }), { status: 422 });
  }
  const body = await request.json().catch(() => null);
  const parsed = ContentDraftSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 422 });
  }
  await contentRepo.upsert(key, parsed.data, session!.userId);
  await auditRepo.record({
    actorId: session!.userId,
    actorEmail: session!.email,
    action: 'content.updated',
    targetType: 'content',
    targetId: key,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get('user-agent') ?? null,
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
