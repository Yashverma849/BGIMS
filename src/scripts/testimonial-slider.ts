/**
 * Single-track testimonial slider with prev/next controls and an 8s auto-
 * advance. Slides are `[data-testimonial]` elements. The active slide gets
 * `display: grid` (the rest are hidden).
 */

const slides = Array.from(
  document.querySelectorAll<HTMLElement>('[data-testimonial]'),
);

if (slides.length > 1) {
  let idx = 0;
  const show = (i: number): void => {
    slides.forEach((s, k) => {
      s.style.display = k === i ? 'grid' : 'none';
    });
  };
  show(0);

  document.querySelectorAll('[data-testimonial-prev]').forEach((b) =>
    b.addEventListener('click', () => {
      idx = (idx - 1 + slides.length) % slides.length;
      show(idx);
    }),
  );
  document.querySelectorAll('[data-testimonial-next]').forEach((b) =>
    b.addEventListener('click', () => {
      idx = (idx + 1) % slides.length;
      show(idx);
    }),
  );

  setInterval(() => {
    idx = (idx + 1) % slides.length;
    show(idx);
  }, 8000);
}
