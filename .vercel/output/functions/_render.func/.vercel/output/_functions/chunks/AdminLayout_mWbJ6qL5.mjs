import { c as createAstro, d as createComponent, r as renderComponent, e as renderTemplate, f as renderSlot } from './astro/server_B9KaNQD4.mjs';
import { $ as $$BaseLayout } from './BaseLayout_FUkmSKvu.mjs';

const $$Astro = createAstro("https://mmbgims.com");
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title, bodyClass = "cms-body" } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "noindex": true, "bare": true, "bodyClass": bodyClass }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
