/**
 * POST /api/enquiries
 *
 * Validates the body via the shared EnquirySchema, persists to a tiny
 * file-system store in dev (`.data/enquiries.json`), and — when
 * `RESEND_API_KEY` is set — fires a confirmation email via Resend.
 *
 * Production swap: replace persistEnquiry() with a call to the institute's
 * managed database; nothing else needs to change.
 */

import type { APIRoute } from 'astro';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { EnquirySchema, newEnquiryId, type Enquiry } from '~lib/schema';

export const prerender = false;

const DATA_DIR = process.env.MMBGIMS_DATA_DIR ?? '.data';
const ENQUIRY_FILE = join(DATA_DIR, 'enquiries.json');

async function readAll(): Promise<Enquiry[]> {
  try {
    const buf = await fs.readFile(ENQUIRY_FILE, 'utf-8');
    return JSON.parse(buf) as Enquiry[];
  } catch {
    return [];
  }
}

async function persistEnquiry(enq: Enquiry): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const all = await readAll();
  all.unshift(enq);
  await fs.writeFile(ENQUIRY_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

async function maybeSendConfirmationEmail(enq: Enquiry): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[enquiries] received ${enq.id} from ${enq.email} (no email sent — RESEND_API_KEY missing)`);
    return;
  }
  // Best-effort fetch to Resend. We don't fail the request if email fails.
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

export const POST: APIRoute = async ({ request }) => {
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

  await persistEnquiry(parsed.data);
  void maybeSendConfirmationEmail(parsed.data);

  return new Response(JSON.stringify(parsed.data), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};
