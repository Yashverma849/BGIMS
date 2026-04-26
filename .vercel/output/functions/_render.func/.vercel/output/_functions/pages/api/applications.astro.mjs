import { A as ApplicationSchema } from '../../chunks/schema_DjDz_9BF.mjs';
import '@libsql/client';
import { a as applicationsRepo } from '../../chunks/applications_C-hXM6jX.mjs';
import { a as auditRepo } from '../../chunks/audit_CPWJxVu1.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request, clientAddress }) => {
  const json = await request.json().catch(() => null);
  if (!json) {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 });
  }
  const parsed = ApplicationSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "validation_failed", issues: parsed.error.issues }),
      { status: 422, headers: { "content-type": "application/json" } }
    );
  }
  await applicationsRepo.insert(parsed.data);
  await auditRepo.record({
    actorId: null,
    actorEmail: parsed.data.personal.email,
    action: "application.submitted",
    targetType: "application",
    targetId: parsed.data.id,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get("user-agent") ?? null,
    metadata: { programme: parsed.data.programme, amount: parsed.data.amount }
  });
  return new Response(JSON.stringify(parsed.data), {
    status: 201,
    headers: { "content-type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
