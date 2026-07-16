/**
 * POST /api/applications
 *
 * Validates with ApplicationSchema, persists to the DB, audit-logs the
 * submission. Public endpoint — rate-limited by middleware. Razorpay
 * webhook (TODO) flips status from 'submitted' to 'paid'.
 */

import type { APIRoute } from 'astro';
import { ApplicationSchema } from '~lib/schema';
import { applicationsRepo, auditRepo } from '~lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const json = await request.json().catch(() => null);
  if (!json) {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
  }
  const parsed = ApplicationSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'validation_failed', issues: parsed.error.issues }),
      { status: 422, headers: { 'content-type': 'application/json' } },
    );
  }

  await applicationsRepo.insert({
    ...parsed.data,
    documents: json.documents,
  });
  await auditRepo.record({
    actorId: null,
    actorEmail: parsed.data.personal.email,
    action: 'application.submitted',
    targetType: 'application',
    targetId: parsed.data.id,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get('user-agent') ?? null,
    metadata: { programme: parsed.data.programme, amount: parsed.data.amount },
  });

  return new Response(JSON.stringify(parsed.data), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};
