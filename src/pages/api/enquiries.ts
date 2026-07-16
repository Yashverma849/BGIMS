/**
 * POST /api/enquiries
 *
 * Validates with EnquirySchema, persists to the DB, optionally fires a
 * Resend confirmation email. Public endpoint — rate-limited by middleware.
 */

import type { APIRoute } from 'astro';
import { EnquirySchema, newEnquiryId, type Enquiry } from '~lib/schema';
import { enquiriesRepo, auditRepo } from '~lib/db';

export const prerender = false;

async function maybeSendConfirmationEmail(enq: Enquiry): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[enquiries] received ${enq.id} from ${enq.email} (no email — RESEND_API_KEY unset)`);
    return;
  }
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: 'MM BGIMS <admissions@mmbgims.com>',
        to: enq.email,
        subject: `We received your enquiry · ${enq.id}`,
        text: `Dear ${enq.name},\n\nThank you for writing to MM BGIMS. The right desk has received your message and we will respond within one working day.\n\nReference: ${enq.id}\n\n— Admissions Office`,
      }),
    });
  } catch (err) {
    console.error('[enquiries] resend failed', err);
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const json = await request.json().catch(() => null);
  if (!json) {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
  }
  const draft = {
    id: typeof json.id === 'string' ? json.id : newEnquiryId(),
    received: typeof json.received === 'string' ? json.received : new Date().toISOString(),
    name: json.name,
    email: json.email,
    phone: json.phone ?? '',
    programme: json.programme ?? 'General enquiry',
    message: json.message,
    consent: json.consent === true,
  };
  const parsed = EnquirySchema.safeParse(draft);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'validation_failed', issues: parsed.error.issues }),
      { status: 422, headers: { 'content-type': 'application/json' } },
    );
  }

  await enquiriesRepo.insert(parsed.data);
  await auditRepo.record({
    actorId: null,
    actorEmail: parsed.data.email,
    action: 'enquiry.received',
    targetType: 'enquiry',
    targetId: parsed.data.id,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get('user-agent') ?? null,
  });
  void maybeSendConfirmationEmail(parsed.data);

  return new Response(JSON.stringify(parsed.data), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};
