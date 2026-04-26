import '@libsql/client';
import { P as ProgrammeIdSchema, d as ApplicationStatusSchema } from '../../../chunks/schema_DjDz_9BF.mjs';
import { a as applicationsRepo } from '../../../chunks/applications_C-hXM6jX.mjs';
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
const GET = async ({ cookies, url }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) return unauthorised();
  const programme = url.searchParams.get("programme");
  const status = url.searchParams.get("status");
  const limit = Number(url.searchParams.get("limit") ?? 1e3);
  const filterProg = programme && ProgrammeIdSchema.safeParse(programme).success ? programme : void 0;
  const filterStatus = status && ApplicationStatusSchema.safeParse(status).success ? status : void 0;
  const [applications, stats] = await Promise.all([
    applicationsRepo.list({ programme: filterProg, status: filterStatus, limit }),
    applicationsRepo.stats()
  ]);
  return new Response(JSON.stringify({ applications, stats }), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
};
const PATCH = async ({ cookies, request, url, clientAddress }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) return unauthorised();
  const id = url.searchParams.get("id");
  const body = await request.json().catch(() => null);
  const status = ApplicationStatusSchema.safeParse(body?.status);
  if (!id || !status.success) {
    return new Response(JSON.stringify({ error: "invalid_input" }), {
      status: 422,
      headers: { "content-type": "application/json" }
    });
  }
  await applicationsRepo.setStatus(id, status.data);
  await auditRepo.record({
    actorId: session.userId,
    actorEmail: session.email,
    action: "application.status_changed",
    targetType: "application",
    targetId: id,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get("user-agent") ?? null,
    metadata: { status: status.data }
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
