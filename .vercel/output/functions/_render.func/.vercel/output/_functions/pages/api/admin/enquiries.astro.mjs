import '@libsql/client';
import '../../../chunks/schema_DjDz_9BF.mjs';
import { e as enquiriesRepo } from '../../../chunks/enquiries_DHTE6f5E.mjs';
import { a as auditRepo } from '../../../chunks/audit_CPWJxVu1.mjs';
import { r as readSession } from '../../../chunks/session_Dk9yDJEf.mjs';
import { i as isAdmin } from '../../../chunks/policies_CgyPR65B.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function unauthorised() {
  return new Response(JSON.stringify({ error: "unauthenticated" }), {
    status: 401,
    headers: { "content-type": "application/json" }
  });
}
const GET = async ({ cookies }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) return unauthorised();
  const enquiries = await enquiriesRepo.list();
  return new Response(JSON.stringify({ enquiries }), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
};
const PATCH = async ({ cookies, request, url, clientAddress }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) return unauthorised();
  const id = url.searchParams.get("id");
  const body = await request.json().catch(() => null);
  const status = body?.status;
  if (!id || !["new", "contacted", "closed"].includes(status)) {
    return new Response(JSON.stringify({ error: "invalid_input" }), {
      status: 422,
      headers: { "content-type": "application/json" }
    });
  }
  await enquiriesRepo.setStatus(id, status);
  await auditRepo.record({
    actorId: session.userId,
    actorEmail: session.email,
    action: "enquiry.status_changed",
    targetType: "enquiry",
    targetId: id,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get("user-agent") ?? null,
    metadata: { status }
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
