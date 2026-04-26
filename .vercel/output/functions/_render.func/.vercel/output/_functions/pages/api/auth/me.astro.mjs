import { c as currentUser } from '../../../chunks/server_DwDCLzQg.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies }) => {
  const user = await currentUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: "unauthenticated" }), {
      status: 401,
      headers: { "content-type": "application/json" }
    });
  }
  return new Response(
    JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }),
    { status: 200, headers: { "content-type": "application/json", "cache-control": "no-store" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
