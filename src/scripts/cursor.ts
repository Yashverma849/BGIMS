/**
 * Custom cursor with magnetic hover-state expansion. Desktop only (hover +
 * fine pointer + min width 768). Subtle 0.18 easing follows the cursor with
 * requestAnimationFrame.
 */

const isDesktop =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(max-width: 768px)').matches;

if (isDesktop) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  let mx = 0;
  let my = 0;
  let cx = 0;
  let cy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  const tick = (): void => {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();

  const hoverSelector = 'a, button, .program-card, .event, .person, [data-cursor]';
  document.querySelectorAll<HTMLElement>(hoverSelector).forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}
