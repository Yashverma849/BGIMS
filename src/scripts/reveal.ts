/**
 * Adds the `.visible` class to `.reveal` and `.reveal-line` elements when they
 * intersect the viewport (12% threshold, with a 60px bottom rootMargin so they
 * start animating slightly before they're fully in-view). Honours
 * prefers-reduced-motion via main.css's @media block.
 */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
);

document.querySelectorAll('.reveal, .reveal-line').forEach((el) => revealObserver.observe(el));
