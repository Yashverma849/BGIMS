import { c as createAstro, d as createComponent, r as renderComponent, e as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_B9KaNQD4.mjs';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_mWbJ6qL5.mjs';
import { s as site } from '../../chunks/BaseLayout_FUkmSKvu.mjs';
import { r as readSession } from '../../chunks/session_Dk9yDJEf.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://mmbgims.com");
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const session = await readSession(Astro2.cookies);
  if (session) {
    return Astro2.redirect("/admin/dashboard");
  }
  const showDemo = undefined                                       === "true";
  const nextHref = Astro2.url.searchParams.get("next") ?? "/admin/dashboard";
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "CMS · Sign in — MM BGIMS", "bodyClass": "login-body" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="login"> <aside class="login__art"> <a href="/" class="login__logo"> <span class="nav__logo-mark">B</span> <span class="nav__logo-text"> <span>${site.name}</span> <small>Est. 2002 · Mumbai</small> </span> </a> <div class="login__art-inner"> <span class="eyebrow">— Content Management</span> <h1>Tend to <em class="italic-accent">the institute</em>.</h1> <p class="login__lede">A quiet workspace for the people who keep BGIMS — its pages, its programmes, its applications and its alumni — in good order.</p> <figure class="login__quote"> <blockquote>"Whoever is careful in small things is rarely careless in large ones."</blockquote> <figcaption>— from a director's office, c. 2002</figcaption> </figure> </div> <svg class="login__ornament" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"> <defs> <pattern id="loginDots" width="20" height="20" patternUnits="userSpaceOnUse"> <circle cx="2" cy="2" r="1" fill="currentColor" opacity=".25"></circle> </pattern> </defs> <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" stroke-width=".5" opacity=".3"></circle> <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" stroke-width=".5" opacity=".4"></circle> <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" stroke-width=".5" opacity=".5"></circle> <rect x="50" y="50" width="300" height="300" fill="url(#loginDots)" opacity=".4"></rect> </svg> <small class="login__footer-note">A private interface. © 2026 MM BGIMS.</small> </aside> <main class="login__main"> <div class="login__form-wrap"> <span class="eyebrow">— Sign in</span> <h2>Welcome back, <em class="italic-accent">colleague</em>.</h2> <p class="login__sub">Use your institute credentials. SSO with Google Workspace coming in the autumn release.</p> <form class="login__form" id="loginForm"${addAttribute(nextHref, "data-next")}> <div class="form-group"> <label for="login-email">Email</label> <input type="email" id="login-email" name="email" autocomplete="email" placeholder="firstname.lastname@mmbgims.com" required${addAttribute("", "value")}> </div> <div class="form-group"> <label for="login-password">Password</label> <input type="password" id="login-password" name="password" autocomplete="current-password" placeholder="Enter password" required${addAttribute("", "value")} minlength="6"> <button type="button" class="login__pwd-toggle" aria-label="Show password" id="pwdToggle">show</button> </div> <div class="login__row"> <label class="login__remember"><input type="checkbox" checked> Keep me signed in</label> <a href="#" class="login__forgot">Forgot password?</a> </div> <button type="submit" class="btn btn--dark btn--large btn--block" data-magnetic>
Sign in <span class="arrow">→</span> </button> <p class="login__error" id="loginError" hidden>
Those credentials don't match anything on record.
</p> </form> ${showDemo} <p class="login__back"><a href="/">← Return to public website</a></p> </div> </main> </div> ` })} `;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/pages/admin/login.astro", void 0);
const $$file = "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
