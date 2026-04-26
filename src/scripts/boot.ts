/**
 * Site-wide boot script. Runs on every public page.
 *
 * Owns the always-on chrome behaviours: page loader exit, scroll progress,
 * sticky-nav scrolled state, mobile menu, and smooth-anchor scrolling.
 *
 * Each behaviour guards on element presence so this single import is safe to
 * run unconditionally from BaseLayout.
 */

function pageLoader(): void {
  window.addEventListener('load', () => {
    const loader = document.querySelector<HTMLElement>('.page-loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('done'), 400);
    setTimeout(() => loader.remove(), 1300);
  });
}

function scrollProgress(): void {
  const progress = document.querySelector<HTMLElement>('.scroll-progress');
  if (!progress) return;
  window.addEventListener(
    'scroll',
    () => {
      const h = document.documentElement;
      const denom = h.scrollHeight - h.clientHeight;
      const pct = denom > 0 ? (h.scrollTop / denom) * 100 : 0;
      progress.style.width = `${pct}%`;
    },
    { passive: true },
  );
}

function stickyNav(): void {
  const nav = document.querySelector<HTMLElement>('.nav');
  if (!nav) return;
  window.addEventListener(
    'scroll',
    () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    },
    { passive: true },
  );
}

function mobileMenu(): void {
  const burger = document.querySelector<HTMLElement>('.nav__hamburger');
  const menu = document.querySelector<HTMLElement>('.nav__menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      menu.classList.remove('open');
    }),
  );
}

function smoothAnchors(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href') ?? '';
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function magneticButtons(): void {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    const strength = 0.25;
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

export function boot(): void {
  pageLoader();
  scrollProgress();
  stickyNav();
  mobileMenu();
  smoothAnchors();
  magneticButtons();
}

boot();
