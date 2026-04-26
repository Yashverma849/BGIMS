/**
 * POST /api/applications
 *
 * Validates the application body via ApplicationSchema and appends to a
 * dev-time JSON store. In production this would write to a database and
 * fire an internal notification (Slack / email) to the admissions office.
 *
 * Razorpay webhook handling is intentionally NOT here — see the README
 * "Razorpay integration" section for the production split: the client
 * calls us once on submit, then Razorpay calls /api/razorpay/webhook on
 * `payment.captured` to flip status from `submitted` to `paid`.
 */

import type { APIRoute } from 'astro';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { ApplicationSchema, type Application } from '~lib/schema';

export const prerender = false;

const DATA_DIR = process.env.MMBGIMS_DATA_DIR ?? '.data';
const APP_FILE = join(DATA_DIR, 'applications.json');

async function readAll(): Promise<Application[]> {
  try {
    const buf = await fs.readFile(APP_FILE, 'utf-8');
    return JSON.parse(buf) as Application[];
  } catch {
    return [];
  }
}

async function persist(app: Application): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const all = await readAll();
  all.push(app);
  await fs.writeFile(APP_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

export const POST: APIRoute = async ({ request }) => {
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

  await persist(parsed.data);
  console.log(`[applications] stored ${parsed.data.id} for ${parsed.data.programme}`);
  return new Response(JSON.stringify(parsed.data), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};
