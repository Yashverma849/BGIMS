import { c as createAstro, d as createComponent, m as maybeRenderHead, g as addAttribute, e as renderTemplate, r as renderComponent, f as renderSlot } from './astro/server_B9KaNQD4.mjs';
import { s as site, $ as $$BaseLayout } from './BaseLayout_FUkmSKvu.mjs';

const $$Astro$2 = createAstro("https://mmbgims.com");
const $$Nav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Nav;
  const path = Astro2.url.pathname.replace(/\/$/, "") || "/";
  const isActive = (href) => {
    if (href === "/") return path === "/";
    return path === href || path.startsWith(href + "/");
  };
  return renderTemplate`${maybeRenderHead()}<nav class="nav"> <a href="/" class="nav__logo"> <span class="nav__logo-mark">B</span> <span class="nav__logo-text"> <span>MM BGIMS</span> <small>Est. 2002 · Mumbai</small> </span> </a> <ul class="nav__menu"> ${site.navMain.map((item) => renderTemplate`<li><a${addAttribute(item.href, "href")}${addAttribute(isActive(item.href) ? "active" : "", "class")}>${item.label}</a></li>`)} </ul> <div class="nav__cta"> <a href="/apply"${addAttribute(`btn btn--accent${isActive("/apply") ? " active" : ""}`, "class")} data-magnetic>
Apply <span class="arrow">→</span> </a> <button class="nav__hamburger" aria-label="Menu"> <span></span><span></span><span></span> </button> </div> </nav>`;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/components/nav/Nav.astro", void 0);

const $$Astro$1 = createAstro("https://mmbgims.com");
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  const { contactEmail = site.emails.admissions, hideNewsletter = false } = Astro2.props;
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer> <div class="container"> <div class="footer__top"> <div class="footer__brand"> <h4>${site.name}</h4> <p> ${site.fullName}. Cultivating principled leadership in the spirit of Mumbai's mercantile
          imagination since ${site.established}.
</p> ${!hideNewsletter && renderTemplate`<form class="footer__newsletter" action="/api/enquiries" method="post" onsubmit="return false"> <input type="email" placeholder="Subscribe to dispatches" name="newsletter"> <button type="submit">Send</button> </form>`} </div> <div> <h5>Programs</h5> <ul> ${site.footer.programs.map((item) => renderTemplate`<li><a${addAttribute(item.href, "href")}>${item.label}</a></li>`)} </ul> </div> <div> <h5>Institute</h5> <ul> ${site.footer.institute.map((item) => renderTemplate`<li><a${addAttribute(item.href, "href")}>${item.label}</a></li>`)} </ul> </div> <div class="footer__contact"> <h5>Visit</h5> <p> ${site.address.line1}<br> ${site.address.line2}<br> ${site.address.line3}<br><br> <a${addAttribute(`tel:${site.phones.primary.tel}`, "href")}>${site.phones.primary.display}</a><br> <a${addAttribute(`mailto:${contactEmail}`, "href")}>${contactEmail}</a> </p> </div> </div> <div class="footer__bottom"> <span>© ${year} ${site.fullName}. All rights reserved.</span> <div class="footer__bottom-links"> ${site.footer.legal.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}>${item.label}</a>`)} </div> </div> </div> </footer>`;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/components/nav/Footer.astro", void 0);

const $$Astro = createAstro("https://mmbgims.com");
const $$PublicLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PublicLayout;
  const { title, description, contactEmail, hideNewsletter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Nav", $$Nav, {})} ${maybeRenderHead()}<main id="main-content" tabindex="-1"> ${renderSlot($$result2, $$slots["default"])} </main> ${renderComponent($$result2, "Footer", $$Footer, { "contactEmail": contactEmail, "hideNewsletter": hideNewsletter })} ` })}`;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/layouts/PublicLayout.astro", void 0);

export { $$PublicLayout as $ };
