import { a as signOut } from '../../../chunks/server_DwDCLzQg.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies, clientAddress }) => {
  await signOut({
    cookies,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? clientAddress ?? void 0,
    userAgent: request.headers.get("user-agent") ?? void 0
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
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
