/**
 * Horizontal marquee tickers — auto-scroll with seamless loop,
 * pause on hover, and manual scroll via drag or wheel.
 */

function initMarquees(): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll<HTMLElement>('.marquee').forEach((root) => {
    const track = root.querySelector<HTMLElement>('.marquee__track');
    if (!track) return;

    let isHovered = false;
    let isDragging = false;
    let isWheeling = false;
    let dragStartX = 0;
    let scrollStart = 0;
    let lastTime = 0;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;

    const duration =
      parseFloat(getComputedStyle(root).getPropertyValue('--marquee-duration')) || 60;

    const halfWidth = (): number => track.scrollWidth / 2;

    const normalizeScroll = (): void => {
      const half = halfWidth();
      if (half <= 0) return;
      while (root.scrollLeft >= half) root.scrollLeft -= half;
      while (root.scrollLeft < 0) root.scrollLeft += half;
    };

    const tick = (time: number): void => {
      const delta = lastTime ? time - lastTime : 0;
      lastTime = time;

      if (!reducedMotion && !isHovered && !isDragging && !isWheeling) {
        const half = halfWidth();
        if (half > 0) {
          root.scrollLeft += (half / (duration * 1000)) * delta;
          normalizeScroll();
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const pauseWheel = (): void => {
      isWheeling = true;
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        isWheeling = false;
      }, 180);
    };

    root.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    root.addEventListener('mouseleave', () => {
      isHovered = false;
      isDragging = false;
      root.classList.remove('is-dragging');
    });

    root.addEventListener(
      'wheel',
      (e) => {
        if (!isHovered) return;
        e.preventDefault();
        pauseWheel();
        root.scrollLeft += e.deltaY + e.deltaX;
        normalizeScroll();
      },
      { passive: false },
    );

    root.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      dragStartX = e.pageX;
      scrollStart = root.scrollLeft;
      root.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      root.scrollLeft = scrollStart - (e.pageX - dragStartX);
      normalizeScroll();
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      root.classList.remove('is-dragging');
    });

    root.addEventListener('scroll', normalizeScroll, { passive: true });

    rafId = requestAnimationFrame(tick);

    window.addEventListener(
      'beforeunload',
      () => {
        if (rafId) cancelAnimationFrame(rafId);
      },
      { once: true },
    );
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMarquees);
} else {
  initMarquees();
}
