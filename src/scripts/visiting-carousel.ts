/**
 * Visiting faculty carousel — sliding window with one-card steps,
 * infinite loop, auto-rotation, pause on hover, drag/wheel/touch scroll.
 */

function getVisibleCount(): number {
  const w = window.innerWidth;
  if (w <= 600) return 1;
  if (w <= 1100) return 2;
  return 4;
}

function initVisitingCarousel(root: HTMLElement): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const viewport = root.querySelector<HTMLElement>('.visiting-carousel__viewport');
  const track = root.querySelector<HTMLElement>('.visiting-carousel__track');
  if (!viewport || !track) return;

  const originals = Array.from(
    track.querySelectorAll<HTMLElement>('[data-visiting-slide]'),
  );
  const total = originals.length;
  if (total <= 1) return;

  let visible = getVisibleCount();
  let index = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let isHovered = false;
  let isDragging = false;
  let isWheeling = false;
  let isAnimating = false;
  let dragStartX = 0;
  let dragDelta = 0;
  let wheelTimer: ReturnType<typeof setTimeout> | null = null;
  let touchStartX = 0;

  root.style.setProperty('--visiting-visible', String(visible));

  const clearClones = (): void => {
    track.querySelectorAll('[data-visiting-clone]').forEach((el) => el.remove());
  };

  const appendClones = (): void => {
    clearClones();
    const count = Math.min(visible, total);
    for (let i = 0; i < count; i++) {
      const clone = originals[i].cloneNode(true) as HTMLElement;
      clone.setAttribute('data-visiting-clone', '');
      clone.removeAttribute('data-visiting-slide');
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.remove('reveal');
      track.appendChild(clone);
    }
  };

  const slideWidth = (): number => viewport.clientWidth / visible;

  const setTransform = (animate: boolean): void => {
    track.style.transition = animate
      ? 'transform 0.75s cubic-bezier(0.77, 0, 0.175, 1)'
      : 'none';
    track.style.transform = `translate3d(-${index * slideWidth()}px, 0, 0)`;
  };

  const resetToStart = (): void => {
    index = 0;
    setTransform(false);
    isAnimating = false;
  };

  const isPaused = (): boolean => isHovered || isDragging || isWheeling;

  const advance = (manual = false): void => {
    if (isAnimating || (!manual && isPaused())) return;

    if (index >= total) {
      resetToStart();
      return;
    }

    isAnimating = true;
    index += 1;
    setTransform(true);
  };

  const retreat = (manual = false): void => {
    if (isAnimating || (!manual && isPaused())) return;

    isAnimating = true;

    if (index <= 0) {
      index = total;
      setTransform(false);
      index = total - 1;
      setTransform(true);
      return;
    }

    index -= 1;
    setTransform(true);
  };

  const onTransitionEnd = (e: TransitionEvent): void => {
    if (e.target !== track || e.propertyName !== 'transform') return;
    isAnimating = false;
    if (index >= total) resetToStart();
  };

  const startTimer = (): void => {
    if (timer) clearInterval(timer);
    if (reducedMotion || total <= visible) return;
    timer = setInterval(() => advance(false), 5000);
  };

  const rebuild = (): void => {
    const nextVisible = getVisibleCount();
    const changed = nextVisible !== visible;
    visible = nextVisible;
    root.style.setProperty('--visiting-visible', String(visible));

    if (index > total) index = 0;
    appendClones();
    setTransform(false);

    if (changed) startTimer();
  };

  appendClones();
  setTransform(false);
  track.addEventListener('transitionend', onTransitionEnd);

  root.addEventListener('mouseenter', () => {
    isHovered = true;
  });
  root.addEventListener('mouseleave', () => {
    isHovered = false;
    isDragging = false;
    root.classList.remove('is-dragging');
  });

  viewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragStartX = e.pageX;
    dragDelta = 0;
    root.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragDelta = e.pageX - dragStartX;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    root.classList.remove('is-dragging');

    if (Math.abs(dragDelta) > 48) {
      if (dragDelta < 0) advance(true);
      else retreat(true);
    }
    dragDelta = 0;
  });

  viewport.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      if (isWheeling) return;

      isWheeling = true;
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        isWheeling = false;
      }, 420);

      const delta = e.deltaY + e.deltaX;
      if (delta > 0) advance(true);
      else if (delta < 0) retreat(true);
    },
    { passive: false },
  );

  viewport.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  viewport.addEventListener(
    'touchend',
    (e) => {
      const distance = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(distance) < 48) return;
      if (distance < 0) advance(true);
      else retreat(true);
    },
    { passive: true },
  );

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      advance(true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      retreat(true);
    }
  });

  let resizeTimer: ReturnType<typeof setTimeout> | null = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuild, 150);
  });

  if (reducedMotion || total <= visible) {
    root.classList.add('is-static');
    return;
  }

  startTimer();
}

function initAll(): void {
  document.querySelectorAll<HTMLElement>('[data-visiting-carousel]').forEach(initVisitingCarousel);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
