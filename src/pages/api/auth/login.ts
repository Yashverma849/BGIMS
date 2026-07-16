/**
 * POST /api/auth/login
 * body: { email, password }
 *
 * 200 → { user: { id, email, name, role } } + Set-Cookie session
 * 401 → { error: 'invalid_credentials' }
 * 422 → { error: 'invalid_input' }
 */

import type { APIRoute } from 'astro';
import { signIn } from '~lib/auth/server';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const body = await request.json().catch(() => null);
  const result = await signIn(body, {
    cookies,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? clientAddress ?? undefined,
    userAgent: request.headers.get('user-agent') ?? undefined,
  });
  if (!result.ok) {
    const status = result.reason === 'invalid_input' ? 422 : 401;
    return new Response(JSON.stringify({ error: result.reason }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ user: result.user }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
