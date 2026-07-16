/** POST /api/auth/logout — clears the session cookie. */

import type { APIRoute } from 'astro';
import { signOut } from '~lib/auth/server';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  await signOut({
    cookies,
    ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? clientAddress ?? undefined,
    userAgent: request.headers.get('user-agent') ?? undefined,
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
