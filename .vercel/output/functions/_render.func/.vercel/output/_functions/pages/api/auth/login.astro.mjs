import { s as signIn } from '../../../chunks/server_DwDCLzQg.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies, clientAddress }) => {
  const body = await request.json().catch(() => null);
  const result = await signIn(body, {
    cookies,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? clientAddress ?? void 0,
    userAgent: request.headers.get("user-agent") ?? void 0
  });
  if (!result.ok) {
    const status = result.reason === "invalid_input" ? 422 : 401;
    return new Response(JSON.stringify({ error: result.reason }), {
      status,
      headers: { "content-type": "application/json" }
    });
  }
  return new Response(JSON.stringify({ user: result.user }), {
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
