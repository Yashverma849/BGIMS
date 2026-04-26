import '@libsql/client';
import { C as ContentDraftSchema } from '../../../chunks/schema_DjDz_9BF.mjs';
import { c as contentRepo } from '../../../chunks/content_BCjmHc1t.mjs';
import { a as auditRepo } from '../../../chunks/audit_CPWJxVu1.mjs';
import { r as readSession } from '../../../chunks/session_Dk9yDJEf.mjs';
import { i as isAdmin } from '../../../chunks/policies_CgyPR65B.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies, url }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) {
    return new Response(JSON.stringify({ error: "unauthenticated" }), { status: 401 });
  }
  const key = url.searchParams.get("key");
  if (!key) {
    return new Response(JSON.stringify({ error: "missing key" }), { status: 422 });
  }
  const draft = await contentRepo.get(key);
  return new Response(JSON.stringify({ draft }), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
};
const PUT = async ({ cookies, url, request, clientAddress }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) {
    return new Response(JSON.stringify({ error: "unauthenticated" }), { status: 401 });
  }
  const key = url.searchParams.get("key");
  if (!key) {
    return new Response(JSON.stringify({ error: "missing key" }), { status: 422 });
  }
  const body = await request.json().catch(() => null);
  const parsed = ContentDraftSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "invalid_input" }), { status: 422 });
  }
  await contentRepo.upsert(key, parsed.data, session.userId);
  await auditRepo.record({
    actorId: session.userId,
    actorEmail: session.email,
    action: "content.updated",
    targetType: "content",
    targetId: key,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get("user-agent") ?? null
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
