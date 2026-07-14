/**
 * Single-track testimonial slider with prev/next controls and an 8s auto-
 * advance. Slides are `[data-testimonial]` elements. The active slide gets
 * `display: grid` (the rest are hidden) and `.is-active` to run slide-in
 * animations on the photo (left → right) and quote (right → left).
 */

const section = document.querySelector<HTMLElement>('.testimonials');
const slides = Array.from(
  document.querySelectorAll<HTMLElement>('[data-testimonial]'),
);

if (slides.length >= 1) {
  let idx = 0;
  let inView = false;

  const animateSlide = (slide: HTMLElement): void => {
    slide.classList.remove('is-active');
    void slide.offsetWidth;
    slide.classList.add('is-active');
  };

  const show = (i: number, animate: boolean): void => {
    slides.forEach((s, k) => {
      if (k === i) {
        s.style.display = 'grid';
        if (animate) animateSlide(s);
      } else {
        s.style.display = 'none';
        s.classList.remove('is-active');
      }
    });
  };

  const advance = (animate: boolean): void => {
    show(idx, animate && inView);
  };

  show(0, false);

  const onEnterView = (): void => {
    inView = true;
    advance(true);
  };

  if (section) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          onEnterView();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(section);
  } else {
    onEnterView();
  }

  if (slides.length > 1) {
    document.querySelectorAll('[data-testimonial-prev]').forEach((b) =>
      b.addEventListener('click', () => {
        idx = (idx - 1 + slides.length) % slides.length;
        advance(true);
      }),
    );
    document.querySelectorAll('[data-testimonial-next]').forEach((b) =>
      b.addEventListener('click', () => {
        idx = (idx + 1) % slides.length;
        advance(true);
      }),
    );

    setInterval(() => {
      idx = (idx + 1) % slides.length;
      advance(true);
    }, 8000);
  }
}
