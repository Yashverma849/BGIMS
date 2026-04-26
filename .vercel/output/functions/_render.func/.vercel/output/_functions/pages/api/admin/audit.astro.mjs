import '@libsql/client';
import '../../../chunks/schema_DjDz_9BF.mjs';
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
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);
  const entries = await auditRepo.recent(limit);
  return new Response(JSON.stringify({ entries }), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
