/**
 * Hero floating particles — 14 brass-coloured dots that drift slowly with
 * randomised animation delays and durations. Adds `.particle` spans into a
 * pre-existing `.hero__particles` container.
 */

const container = document.querySelector<HTMLElement>('.hero__particles');
if (container) {
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    p.style.animationDuration = `${8 + Math.random() * 6}s`;
    container.appendChild(p);
  }
}
