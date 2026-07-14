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

function initTypewriters(): void {
  const elements = document.querySelectorAll<HTMLElement>('.typewriter-text');
  
  elements.forEach((el) => {
    const originalHTML = el.innerHTML;
    el.innerHTML = '';
    
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = originalHTML;
    
    const cloneNodeStructure = (source: Node, target: Node) => {
      source.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const textNode = document.createTextNode('');
          target.appendChild(textNode);
        } else {
          const elementNode = child.cloneNode(false);
          target.appendChild(elementNode);
          cloneNodeStructure(child, elementNode);
        }
      });
    };
    
    cloneNodeStructure(tempContainer, el);
    
    const textQueue: { node: Text; fullText: string }[] = [];
    const collectTextNodes = (source: Node, target: Node) => {
      let targetChild = target.firstChild;
      source.childNodes.forEach((sourceChild) => {
        if (sourceChild.nodeType === Node.TEXT_NODE) {
          if (targetChild && targetChild.nodeType === Node.TEXT_NODE) {
            textQueue.push({
              node: targetChild as Text,
              fullText: sourceChild.textContent || '',
            });
          }
        } else {
          if (targetChild) {
            collectTextNodes(sourceChild, targetChild);
          }
        }
        if (targetChild) targetChild = targetChild.nextSibling;
      });
    };
    
    collectTextNodes(tempContainer, el);
    
    const revealAncestor = el.closest('.reveal');
    if (revealAncestor) {
      if (revealAncestor.classList.contains('visible')) {
        const delayAttr = parseFloat(revealAncestor.getAttribute('data-delay') || '0');
        const delayMs = (delayAttr * 100) + 150;
        setTimeout(() => animateTypewriter(textQueue), delayMs);
      } else {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && revealAncestor.classList.contains('visible')) {
              observer.disconnect();
              const delayAttr = parseFloat(revealAncestor.getAttribute('data-delay') || '0');
              const delayMs = (delayAttr * 100) + 300;
              setTimeout(() => animateTypewriter(textQueue), delayMs);
            }
          });
        });
        observer.observe(revealAncestor, { attributes: true });
      }
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(el);
              animateTypewriter(textQueue);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
    }
  });
}

function animateTypewriter(queue: { node: Text; fullText: string }[]): void {
  let queueIndex = 0;
  let charIndex = 0;
  
  function typeNextChar() {
    if (queueIndex >= queue.length) return;
    
    const current = queue[queueIndex];
    if (charIndex < current.fullText.length) {
      current.node.textContent += current.fullText[charIndex];
      charIndex++;
      setTimeout(typeNextChar, 18); // 18ms per character (clearly visible typing)
    } else {
      queueIndex++;
      charIndex = 0;
      setTimeout(typeNextChar, 100); // slight pause between blocks
    }
  }
  
  typeNextChar();
}

export function boot(): void {
  pageLoader();
  scrollProgress();
  stickyNav();
  mobileMenu();
  smoothAnchors();
  magneticButtons();
  initTypewriters();
}

boot();
