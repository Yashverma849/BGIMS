import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_6yXaYR3x.mjs';
import { manifest } from './manifest_C3er5ZiK.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin/dashboard.astro.mjs');
const _page4 = () => import('./pages/admin/login.astro.mjs');
const _page5 = () => import('./pages/admissions.astro.mjs');
const _page6 = () => import('./pages/alumni.astro.mjs');
const _page7 = () => import('./pages/api/admin/applications.astro.mjs');
const _page8 = () => import('./pages/api/admin/audit.astro.mjs');
const _page9 = () => import('./pages/api/admin/content.astro.mjs');
const _page10 = () => import('./pages/api/admin/enquiries.astro.mjs');
const _page11 = () => import('./pages/api/admin/seed-demo.astro.mjs');
const _page12 = () => import('./pages/api/applications.astro.mjs');
const _page13 = () => import('./pages/api/auth/login.astro.mjs');
const _page14 = () => import('./pages/api/auth/logout.astro.mjs');
const _page15 = () => import('./pages/api/auth/me.astro.mjs');
const _page16 = () => import('./pages/api/enquiries.astro.mjs');
const _page17 = () => import('./pages/api/health.astro.mjs');
const _page18 = () => import('./pages/apply.astro.mjs');
const _page19 = () => import('./pages/contact.astro.mjs');
const _page20 = () => import('./pages/events/_id_.astro.mjs');
const _page21 = () => import('./pages/events.astro.mjs');
const _page22 = () => import('./pages/faculty.astro.mjs');
const _page23 = () => import('./pages/placements.astro.mjs');
const _page24 = () => import('./pages/programs.astro.mjs');
const _page25 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/.pnpm/astro@4.16.19_@types+node@24.12.2_rollup@4.60.2_typescript@5.9.3/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin/dashboard.astro", _page3],
    ["src/pages/admin/login.astro", _page4],
    ["src/pages/admissions.astro", _page5],
    ["src/pages/alumni.astro", _page6],
    ["src/pages/api/admin/applications.ts", _page7],
    ["src/pages/api/admin/audit.ts", _page8],
    ["src/pages/api/admin/content.ts", _page9],
    ["src/pages/api/admin/enquiries.ts", _page10],
    ["src/pages/api/admin/seed-demo.ts", _page11],
    ["src/pages/api/applications.ts", _page12],
    ["src/pages/api/auth/login.ts", _page13],
    ["src/pages/api/auth/logout.ts", _page14],
    ["src/pages/api/auth/me.ts", _page15],
    ["src/pages/api/enquiries.ts", _page16],
    ["src/pages/api/health.ts", _page17],
    ["src/pages/apply.astro", _page18],
    ["src/pages/contact.astro", _page19],
    ["src/pages/events/[id].astro", _page20],
    ["src/pages/events.astro", _page21],
    ["src/pages/faculty.astro", _page22],
    ["src/pages/placements.astro", _page23],
    ["src/pages/programs.astro", _page24],
    ["src/pages/index.astro", _page25]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "a7cafbc6-c0fb-469d-9fcd-ef2645cabe4b",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
