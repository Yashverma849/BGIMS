/** Stagger the per-word translateY animation on the hero headline. */

document.querySelectorAll<HTMLElement>('.hero__title .word > span').forEach((w, i) => {
  w.style.animationDelay = `${i * 0.08 + 0.4}s`;
});
