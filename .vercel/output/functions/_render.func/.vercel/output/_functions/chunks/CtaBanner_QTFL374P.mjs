import { c as createAstro, d as createComponent, m as maybeRenderHead, g as addAttribute, e as renderTemplate, u as unescapeHTML } from './astro/server_B9KaNQD4.mjs';

const $$Astro = createAstro("https://mmbgims.com");
const $$CtaBanner = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CtaBanner;
  const {
    title,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    dark = false,
    eyebrow,
    body
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(`cta-banner${dark ? " cta-banner--dark" : ""}`, "class")}> <div class="container"> <div class="cta-banner__inner reveal"> <div> ${eyebrow && renderTemplate`<span class="eyebrow">${eyebrow}</span>`} <h2>${unescapeHTML(title)}</h2> ${body && renderTemplate`<p>${body}</p>`} </div> <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;"> <a${addAttribute(primaryHref, "href")} class="btn btn--accent" data-magnetic> ${primaryLabel} <span class="arrow">→</span> </a> ${secondaryHref && secondaryLabel && renderTemplate`<a${addAttribute(secondaryHref, "href")} class="btn btn--ghost">${secondaryLabel}</a>`} </div> </div> </div> </section>`;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/components/layout/CtaBanner.astro", void 0);

export { $$CtaBanner as $ };
