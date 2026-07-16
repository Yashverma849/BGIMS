/** GET /api/auth/me — returns the current session's user, or 401 if anonymous. */

import type { APIRoute } from 'astro';
import { currentUser } from '~lib/auth/server';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const user = await currentUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  return new Response(
    JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }),
    { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } },
  );
};
