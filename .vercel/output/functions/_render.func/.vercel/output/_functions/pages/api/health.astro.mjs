export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async () => {
  return new Response(
    JSON.stringify({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: process.env.MMBGIMS_VERSION ?? "dev"
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store"
      }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
