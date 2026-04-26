/**
 * Animates `[data-count]` elements to their target integer when they enter
 * the viewport (40% threshold). 1.8s duration with ease-out-quart; final value
 * formatted via toLocaleString for thousands-separators.
 */

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      const target = parseInt(el.dataset.count ?? '0', 10);
      const numEl = el.querySelector<HTMLElement>('.num') ?? el;
      const duration = 1800;
      const start = performance.now();

      const animate = (now: number): void => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        numEl.textContent = Math.floor(eased * target).toLocaleString();
        if (t < 1) requestAnimationFrame(animate);
        else numEl.textContent = target.toLocaleString();
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.4 },
);

document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));
