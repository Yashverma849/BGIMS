import { c as createAstro, d as createComponent, m as maybeRenderHead, g as addAttribute, u as unescapeHTML, e as renderTemplate, r as renderComponent, F as Fragment } from '../chunks/astro/server_B9KaNQD4.mjs';
import { $ as $$PublicLayout } from '../chunks/PublicLayout_BdLA2cDQ.mjs';
import { $ as $$CtaBanner } from '../chunks/CtaBanner_QTFL374P.mjs';
import { g as getCollection } from '../chunks/_astro_content_CFIrjxqZ.mjs';
import { H as HOME_MARQUEE_RECRUITERS } from '../chunks/recruiters_Dodmam6K.mjs';
import '@libsql/client';
import '../chunks/schema_DjDz_9BF.mjs';
import { c as contentRepo } from '../chunks/content_BCjmHc1t.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://mmbgims.com");
const $$ProgramCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProgramCard;
  const { programme, delay } = Astro2.props;
  const p = programme.data;
  const titleHtml = p.title.replace(/&/, "<em>&</em>").replace("Bachelor of Management", "Bachelor of <em>Management</em>");
  return renderTemplate`${maybeRenderHead()}<article class="program-card reveal"${addAttribute(delay, "data-delay")}> <div class="program-card__num">№ ${p.numeral}</div> <h3 class="program-card__title">${unescapeHTML(titleHtml)}</h3> <div class="program-card__meta"> <span>${p.duration}</span> <span>${p.type}</span> <span>${p.affiliation}</span> </div> <p class="program-card__desc">${p.blurb}</p> <span class="program-card__arrow">↗</span> </article>`;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/components/programmes/ProgramCard.astro", void 0);

const $$Astro = createAstro("https://mmbgims.com");
const $$PersonCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PersonCard;
  const { person, delay } = Astro2.props;
  const p = person.data;
  return renderTemplate`${maybeRenderHead()}<article class="person reveal"${addAttribute(delay, "data-delay")}> <div class="person__img"> <div class="person__img-inner">${p.initials}</div> </div> <span class="person__role">${p.role}</span> <h4 class="person__name">${p.name}</h4> <span class="person__expertise">${p.bio}</span> </article>`;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/components/people/PersonCard.astro", void 0);

const HOME_TESTIMONIALS = [
  {
    initials: "AP",
    body: "MM BGIMS gave a real boost to my career. I learnt management lessons that {{em}} my life to a greater extent. Encouraging faculty, innovative pedagogy — this is where I learned to make decisions, not just analyses.",
    bodyEm: "transformed",
    cite: "Abhinay Patil",
    citeMeta: "Marketing Strategist, SaaSMAX Corp · USA · Class of 2018"
  },
  {
    initials: "TS",
    body: "My MMS at MM BGIMS brought clarity of thought, knowledge, confidence — and the {{em}} to act. I was placed at the Bombay Stock Exchange, the dream company of many MBA aspirants.",
    bodyEm: "conviction",
    cite: "Tushar Shetty",
    citeMeta: "Management Executive, BSE · Class of 2019"
  },
  {
    initials: "KC",
    body: "Here, your voice is {{em}} and your opinion counts. Today I work in a global HR role at Capgemini — and every framework, every conversation I had at MM BGIMS, I find replicated in my work.",
    bodyEm: "heard",
    cite: "Kamika Chitre",
    citeMeta: "HR Business Partner, Capgemini India · Class of 2020"
  }
];

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const programmes = (await getCollection("programmes")).sort((a, b) => a.data.order - b.data.order);
  const allFaculty = await getCollection("faculty");
  const facultyPreview = allFaculty.filter((f) => f.data.type === "director" || f.data.type === "core").sort((a, b) => a.data.order - b.data.order).slice(0, 3);
  const events = (await getCollection("events")).sort((a, b) => +new Date(b.data.date) - +new Date(a.data.date)).slice(0, 3);
  const marquee = [...HOME_MARQUEE_RECRUITERS, ...HOME_MARQUEE_RECRUITERS];
  const draft = await contentRepo.get("home_hero").catch(() => null);
  const heroH1 = draft?.h1 ?? "Where heritage meets tomorrow's leaders.";
  const heroLede = draft?.lede ?? "For over two decades, Maratha Mandir's Babasaheb Gawde Institute of Management Studies has shaped Mumbai's most distinguished minds in finance, strategy, and enterprise \u2014 pairing rigorous scholarship with the city's pulse for global commerce.";
  const heroWords = heroH1.split(/\s+/).filter(Boolean);
  return renderTemplate`${renderComponent($$result, "PublicLayout", $$PublicLayout, { "title": "MM BGIMS \u2014 Where Heritage Meets Tomorrow's Leaders", "description": "Maratha Mandir's Babasaheb Gawde Institute of Management Studies \u2014 Mumbai's distinguished management school crafting principled leaders since 2002." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<header class="hero"> <div class="hero__bg"> <div class="hero__pattern"></div> <div class="hero__particles"></div> </div> <div class="hero__ornament" aria-hidden="true"> <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg"> <defs> <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"> <circle cx="30" cy="30" r="0.5" fill="#5C1A1B" opacity="0.15"></circle> </pattern> </defs> <rect width="600" height="600" fill="url(#grid)"></rect> <circle cx="300" cy="300" r="280" fill="none" stroke="#B8965A" stroke-width="0.5" opacity="0.4"></circle> <circle cx="300" cy="300" r="220" fill="none" stroke="#5C1A1B" stroke-width="0.5" opacity="0.3"></circle> <circle cx="300" cy="300" r="160" fill="none" stroke="#B8965A" stroke-width="0.5" opacity="0.4"></circle> <circle cx="300" cy="300" r="100" fill="none" stroke="#5C1A1B" stroke-width="0.5" opacity="0.3"></circle> <g stroke="#B8965A" stroke-width="0.4" opacity="0.5" fill="none"> <line x1="300" y1="20" x2="300" y2="580"></line> <line x1="20" y1="300" x2="580" y2="300"></line> <line x1="60" y1="60" x2="540" y2="540"></line> <line x1="540" y1="60" x2="60" y2="540"></line> </g> <text x="300" y="305" text-anchor="middle" font-family="Cormorant Garamond" font-size="180" fill="#5C1A1B" opacity="0.08">B</text> </svg> </div> <div class="container hero__content"> <div class="hero__meta reveal"> <span>Mumbai</span> <span>Estd. 2002</span> <span>NAAC B<sup>++</sup></span> <span>AICTE Approved</span> </div> <h1 class="hero__title"> ${heroWords.map((word, i) => {
    const isAccent = /tomorrow|tomorrow['’]s/i.test(word);
    const breakAfter = i > 0 && i % 2 === 1 && i < heroWords.length - 1;
    return renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span class="word"><span>${unescapeHTML(isAccent ? `<em>${word}</em>` : word)}</span></span> ${breakAfter ? renderTemplate`<br>` : " "}` })}`;
  })} </h1> <div class="hero__bottom reveal" data-delay="3"> <p class="hero__lead">${heroLede}</p> <div class="hero__cta"> <a href="/programs" class="btn btn--accent" data-magnetic>Explore Programs <span class="arrow">→</span></a> <a href="/about" class="btn btn--ghost">Our Story</a> </div> </div> </div> <div class="ticker"> <div class="ticker__track"> <span>Affiliated to the University of Mumbai</span> <span>Approved by AICTE, New Delhi</span> <span>Accredited NAAC B<sup>++</sup></span> <span>Choice Code 311310210</span> <span>Member · AIMS</span> <span>2,000+ Alumni Worldwide</span> <span>23 Years of Excellence</span> <span>Affiliated to the University of Mumbai</span> <span>Approved by AICTE, New Delhi</span> <span>Accredited NAAC B<sup>++</sup></span> <span>Choice Code 311310210</span> <span>Member · AIMS</span> <span>2,000+ Alumni Worldwide</span> <span>23 Years of Excellence</span> </div> </div> </header>  <section id="heritage"> <div class="container"> <div class="feature-grid"> <div class="feature-img reveal"> <div class="feature-img__year">23<span class="serif-italic" style="font-size:0.4em;">years</span></div> <div class="feature-img__inner" style="background: linear-gradient(135deg, #3D0E10 0%, #722325 50%, #B8965A 100%); display: grid; place-items: center; color: #F5EAD3;"> <svg viewBox="0 0 200 250" width="60%" fill="currentColor" opacity="0.92"> <rect x="20" y="180" width="160" height="60" fill="#0F0C0A"></rect> <rect x="40" y="100" width="120" height="80" fill="#1A1614"></rect> <polygon points="20,100 100,40 180,100" fill="#2B2522"></polygon> <rect x="90" y="40" width="20" height="30" fill="#B8965A" opacity="0.7"></rect> <circle cx="100" cy="55" r="6" fill="#B8965A"></circle> <rect x="50" y="120" width="14" height="40" fill="#0F0C0A"></rect> <rect x="80" y="120" width="14" height="40" fill="#0F0C0A"></rect> <rect x="106" y="120" width="14" height="40" fill="#0F0C0A"></rect> <rect x="136" y="120" width="14" height="40" fill="#0F0C0A"></rect> <rect x="50" y="190" width="100" height="40" fill="#0F0C0A"></rect> <rect x="92" y="190" width="16" height="40" fill="#B8965A" opacity="0.6"></rect> <rect x="20" y="240" width="160" height="6" fill="#B8965A" opacity="0.4"></rect> <text x="100" y="223" font-family="Cormorant Garamond, serif" font-size="14" font-weight="500" fill="#B8965A" text-anchor="middle">B G I M S</text> </svg> </div> <span class="feature-img__caption">The Mumbai Central Campus</span> </div> <div class="reveal" data-delay="2"> <span class="eyebrow">A Note on our Heritage</span> <h2 style="margin: 1.2rem 0 1.5rem;">
A management school <em class="italic-accent" style="color: var(--accent);">cultivated</em>
in the spirit of Mumbai's mercantile imagination.
</h2> <p class="lead" style="margin-bottom: 1.5rem;">
Founded under the aegis of the venerable <strong>Maratha Mandir Trust</strong>, MM BGIMS has, since its inception in 2002, occupied a singular position in the Indian management education landscape — close enough to Dalal Street to feel its tremors, distant enough from convention to think for itself.
</p> <p>
Our programs are taught by faculty drawn from boardrooms and seminar rooms in equal measure. Our students walk into Mumbai Central as candidates and leave as practitioners, prepared for the questions tomorrow has not yet asked.
</p> <div style="display: flex; gap: 2rem; margin-top: 2.5rem; flex-wrap: wrap;"> <a href="/about" class="link-underline">Read our story <span>→</span></a> <a href="/about#governing-body" class="link-underline">Governing body <span>→</span></a> </div> </div> </div> </div> </section>  <section class="stats"> <div class="container-wide"> <div class="stats__grid"> <div class="stat reveal"> <div class="stat__number" data-count="2000"><span class="num">0</span><sup>+</sup></div> <div class="stat__label">Illustrious Alumni</div> <div class="stat__detail">Across six continents and every Fortune 500 industry.</div> </div> <div class="stat reveal" data-delay="1"> <div class="stat__number" data-count="100"><span class="num">0</span><sup>%</sup></div> <div class="stat__label">Placement Assistance</div> <div class="stat__detail">Dedicated cell. Live since cohort one.</div> </div> <div class="stat reveal" data-delay="2"> <div class="stat__number" data-count="50"><span class="num">0</span><sup>+</sup></div> <div class="stat__label">Industry Faculty</div> <div class="stat__detail">Practitioners who lecture; lecturers who practice.</div> </div> <div class="stat reveal" data-delay="3"> <div class="stat__number" data-count="180"><span class="num">0</span><sup>+</sup></div> <div class="stat__label">Recruiting Partners</div> <div class="stat__detail">From Morgan Stanley to the Tata Group.</div> </div> </div> </div> </section>  <section id="programs"> <div class="container"> <div class="section-header reveal"> <div> <span class="eyebrow">Our Disciplines</span> <h2 style="margin-top: 1rem;">Four programs.<br>Each <em class="italic-accent" style="color: var(--accent);">distinct</em>. Each rigorous.</h2> </div> <a href="/programs" class="link-underline">View all programs <span>→</span></a> </div> <div class="programs__grid"> ${programmes.map((p, i) => renderTemplate`${renderComponent($$result2, "ProgramCard", $$ProgramCard, { "programme": p, "delay": i })}`)} </div> </div> </section>  <section style="background: var(--cream-100); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);"> <div class="container-tight"> <div class="ornament-divider reveal">✦ A Word from the Director ✦</div> <p class="reveal" style="font-family: var(--font-display); font-size: clamp(1.6rem, 3vw, 2.4rem); line-height: 1.3; font-weight: 400; text-align: center; max-width: 30ch; margin: 0 auto 2rem; color: var(--ink-900); letter-spacing: -0.015em;">
"We do not <em class="italic-accent" style="color: var(--accent);">teach</em> management here.<br>
We <em class="italic-accent" style="color: var(--accent);">cultivate</em> the temperament<br>that makes management <em class="italic-accent" style="color: var(--accent);">possible</em>."
</p> <div class="reveal" data-delay="1" style="text-align: center; padding-top: 1rem;"> <strong style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--ink-900); display: block; margin-bottom: 0.25rem;">Dr. Vidya Hattangadi</strong> <span style="font-family: var(--font-serif); font-style: italic; color: var(--muted); font-size: 0.95rem;">Director, MM BGIMS</span> </div> </div> </section>  <section id="faculty-preview"> <div class="container"> <div class="section-header reveal"> <div> <span class="eyebrow">Our Scholars</span> <h2 style="margin-top: 1rem;">Faculty who <em class="italic-accent" style="color: var(--accent);">read</em>,<br>and write what others read.</h2> </div> <a href="/faculty" class="link-underline">Meet the faculty <span>→</span></a> </div> <div class="people-grid"> ${facultyPreview.map((p, i) => renderTemplate`${renderComponent($$result2, "PersonCard", $$PersonCard, { "person": p, "delay": i })}`)} </div> </div> </section>  <section class="testimonials"> <div class="container"> <div class="reveal" style="text-align: center; margin-bottom: 4rem;"> <span class="eyebrow" style="color: var(--brass-400);">In Their Own Words</span> <h2 style="margin-top: 1rem; color: var(--cream-100);">The voices of our alumni.</h2> </div> ${HOME_TESTIMONIALS.map((t) => {
    const [pre, post] = t.bodyEm ? t.body.split("{{em}}") : [t.body, ""];
    return renderTemplate`<div data-testimonial class="testimonial"> <div class="testimonial__visual"> <div class="testimonial__visual-mark">${t.initials}</div> </div> <div> <p class="testimonial__body"> ${pre}${t.bodyEm && renderTemplate`<em>${t.bodyEm}</em>`}${post} </p> <div class="testimonial__cite"> <strong>${t.cite}</strong> <span>${t.citeMeta}</span> </div> </div> </div>`;
  })} <div class="testimonial-nav"> <button data-testimonial-prev aria-label="Previous">←</button> <button data-testimonial-next aria-label="Next">→</button> </div> </div> </section>  <section class="recruiters"> <div class="container"> <div class="recruiters__intro reveal"> <span class="eyebrow">Class of 2024 · Recruiters</span> <h3 style="margin-top: 1rem;">From Mumbai's <em class="italic-accent" style="color: var(--accent);">trading floors</em> to global capitals.</h3> <p>A few of the firms that have hired our graduates over the past 23 years.</p> </div> </div> <div class="marquee"> <div class="marquee__track"> ${marquee.map((name) => renderTemplate`<span class="marquee__item">${name}</span>`)} </div> </div> </section>  <section id="events"> <div class="container"> <div class="section-header reveal"> <div> <span class="eyebrow">News & Notes</span> <h2 style="margin-top: 1rem;">Recent <em class="italic-accent" style="color: var(--accent);">moments</em>.</h2> </div> <a href="/events" class="link-underline">All events & news <span>→</span></a> </div> <div class="events__grid"> ${events.map((ev, i) => renderTemplate`<a href="/events" class="event-link"> <article class="event reveal"${addAttribute(i, "data-delay")}> <div class="event__date"> <strong>${new Date(ev.data.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</strong> <span>${ev.data.categoryLabel}</span> </div> <h4 class="event__title">${ev.data.title}</h4> <p class="event__excerpt">${ev.data.excerpt}</p> <span class="event__cta">Read account <span>→</span></span> </article> </a>`)} </div> </div> </section> ${renderComponent($$result2, "CtaBanner", $$CtaBanner, { "title": `Admissions for the<br><em class="italic-accent" style="color: var(--accent);">2026\u20142028</em> cohort<br>are now open.`, "primaryHref": "/apply", "primaryLabel": "Begin Application", "secondaryHref": "/admissions", "secondaryLabel": "Process & Eligibility" })} ` })} `;
}, "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/pages/index.astro", void 0);

const $$file = "/Users/tida/Documents/Cursor Projects/MMBGIMS-Website/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
