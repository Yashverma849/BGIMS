import { c as createAstro, d as createComponent, g as addAttribute, e as renderTemplate, u as unescapeHTML, h as renderHead, r as renderComponent, F as Fragment, f as renderSlot } from './astro/server_B9KaNQD4.mjs';
/* empty css                             */

const site = {
  name: "MM BGIMS",
  fullName: "Maratha Mandir's Babasaheb Gawde Institute of Management Studies",
  tagline: "Where Heritage Meets Tomorrow’s Leaders",
  description: "Maratha Mandir's Babasaheb Gawde Institute of Management Studies — Mumbai's distinguished management school crafting principled leaders since 2002.",
  established: 2002,
  url: "https://mmbgims.com",
  address: {
    line1: "Maratha Mandir Annexe",
    line2: "Dr. A. B. Nair Road, Mumbai Central",
    line3: "Mumbai 400 008 · Maharashtra"
  },
  phones: {
    primary: { display: "+91 96195 10513", tel: "+919619510513" }},
  emails: {
    admissions: "admissions@mmbgims.com"},
  navMain: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/placements", label: "Placements" },
    { href: "/faculty", label: "Faculty" },
    { href: "/contact", label: "Contact" }
  ],
  footer: {
    programs: [
      { href: "/programs", label: "MBA · Banking & Finance" },
      { href: "/programs", label: "MMS" },
      { href: "/programs", label: "BMS" },
      { href: "/programs", label: "Ph.D. Programme" }
    ],
    institute: [
      { href: "/about", label: "About" },
      { href: "/faculty", label: "Faculty" },
      { href: "/placements", label: "Placements" },
      { href: "/events", label: "Events & News" },
      { href: "/alumni", label: "Alumni" },
      { href: "/admissions", label: "Admissions" },
      { href: "/contact", label: "Contact" },
      { href: "/apply", label: "Apply" },
      { href: "/admin/login", label: "CMS Login" }
    ],
    legal: [
      { href: "#", label: "Privacy" },
      { href: "#", label: "Terms" },
      { href: "#", label: "Mandatory Disclosure" },
      { href: "#", label: "Grievance" }
    ]
  }};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://mmbgims.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = `${site.name} \u2014 ${site.tagline}`,
    description = site.description,
    noindex = false,
    bodyClass = "",
    bare = false
  } = Astro2.props;
  const canonical = new URL(Astro2.url.pathname, Astro2.site ?? site.url).toString();
  const isHome = Astro2.url.pathname === "/" || Astro2.url.pathname === "";
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(description, "content")}>${noindex && renderTemplate`<meta name="robots" content="noindex,nofollow">`}<link rel="canonical"${addAttribute(canonical, "href")}><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:site_name"${addAttribute(site.name, "content")}><meta property="og:locale" content="en_IN"><meta property="og:image"${addAttribute(new URL("/og.svg", Astro2.site ?? site.url).toString(), "content")}><meta property="og:image:type" content="image/svg+xml"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="theme-color" content="#0F0C0A"><meta name="format-detection" content="telephone=no"><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Italiana&family=Manrope:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><link rel="icon" href="/favicon.svg" type="image/svg+xml">${isHome && renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.fullName,
    alternateName: site.name,
    url: site.url,
    foundingDate: String(site.established),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: "Mumbai",
      postalCode: "400008",
      addressRegion: "Maharashtra",
      addressCountry: "IN"
    },
    telephone: site.phones.primary.display,
    email: site.emails.admissions
  })))}${renderHead()}</head> <body${addAttribute(bodyClass, "class")}> ${!bare && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a href="#main-content" class="skip-link">Skip to content</a> <div class="page-loader"><div class="page-loader__mark"><em>BG</em>IMS</div></div> <div class="scroll-progress"></div> ` })}`} ${renderSlot($$result, $$slots["default"])}  </body> </html>`;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, site as s };
