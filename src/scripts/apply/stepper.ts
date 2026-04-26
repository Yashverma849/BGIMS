/**
 * Apply form stepper — toggles `is-active` on the current `.apply-step`
 * panel and the matching `.stepper__item` indicator. `is-done` marks
 * previously-completed steps. Smooth-scrolls to the form on every change so
 * the user always lands at the top of the new step.
 *
 * Triggered by `[data-next]` / `[data-prev]` buttons whose value is the
 * target step index.
 */

const form = document.getElementById('applyForm') as HTMLFormElement | null;
if (form) {
  const steps = Array.from(form.querySelectorAll<HTMLElement>('.apply-step'));
  const stepperItems = Array.from(
    document.querySelectorAll<HTMLElement>('.stepper__item'),
  );
  const applySection = document.querySelector<HTMLElement>('.apply-section');

  function goToStep(n: string | number): void {
    const target = String(n);
    steps.forEach((s) =>
      s.classList.toggle('is-active', s.dataset.step === target),
    );
    stepperItems.forEach((s) => {
      s.classList.toggle('is-active', s.dataset.step === target);
      s.classList.toggle(
        'is-done',
        Number(s.dataset.step ?? 0) < Number(target),
      );
    });
    if (applySection) {
      window.scrollTo({
        top: applySection.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  }

  document.querySelectorAll<HTMLButtonElement>('[data-next]').forEach((b) =>
    b.addEventListener('click', () => goToStep(b.dataset.next ?? '1')),
  );
  document.querySelectorAll<HTMLButtonElement>('[data-prev]').forEach((b) =>
    b.addEventListener('click', () => goToStep(b.dataset.prev ?? '1')),
  );
}
