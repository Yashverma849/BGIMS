/**
 * Generic client-side filter chips. Wires `.ev-chip[data-filter]` buttons to
 * `.ev-card[data-cat]` cards. Used on the events page; the same pattern can
 * be reused on alumni / news / placements with different selectors via the
 * data-target attribute.
 */

const chips = document.querySelectorAll<HTMLButtonElement>('.ev-chip');
const cards = document.querySelectorAll<HTMLElement>('#evGrid .ev-card');

chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    chips.forEach((x) => x.classList.remove('is-active'));
    chip.classList.add('is-active');
    const filter = chip.dataset.filter ?? 'all';
    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.cat === filter;
      card.style.display = matches ? '' : 'none';
    });
  }),
);
