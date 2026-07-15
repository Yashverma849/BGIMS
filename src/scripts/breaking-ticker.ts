/**
 * Vertical "breaking news" tickers — one item visible in the window,
 * auto-advancing on a fixed interval with a seamless loop.
 */

function initBreakingTickers(): void {
  document.querySelectorAll<HTMLElement>('[data-breaking-ticker]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('.breaking-ticker__track');
    const windowEl = root.querySelector<HTMLElement>('.breaking-ticker__window');
    if (!track || !windowEl) return;

    const items = track.querySelectorAll<HTMLElement>('.breaking-ticker__item');
    if (items.length < 2) return;

    const interval = parseInt(root.getAttribute('data-interval') || '3200', 10);
    const total = items.length - 1;
    let index = 0;
    let timer: ReturnType<typeof setInterval> | null = null;

    const setPosition = (nextIndex: number, animate: boolean): void => {
      track.style.transition = animate
        ? 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
        : 'none';
      track.style.transform = `translateY(-${nextIndex * 100}%)`;
    };

    const advance = (): void => {
      index += 1;
      setPosition(index, true);

      if (index >= total) {
        window.setTimeout(() => {
          index = 0;
          setPosition(0, false);
        }, 650);
      }
    };

    const start = (): void => {
      if (timer) return;
      timer = setInterval(advance, interval);
    };

    const stop = (): void => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    };

    setPosition(0, false);
    start();

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', (e) => {
      if (!root.contains(e.relatedTarget as Node | null)) start();
    });
  });
}

initBreakingTickers();
