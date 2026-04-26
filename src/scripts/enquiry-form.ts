/**
 * Contact-page enquiry form (placeholder mode).
 *
 * Backend is currently disabled. The form validates client-side and
 * shows a thank-you, but it does NOT POST to the API. The honeypot still
 * silently swallows bot submissions. Re-enable the real persistence per
 * the comment block in astro.config.mjs.
 */

import { EnquirySchema, newEnquiryId } from '~lib/schema';
import { track } from '~lib/analytics';

document.querySelectorAll<HTMLFormElement>('[data-form="enquiry"]').forEach((form) => {
  const successEl = form.querySelector<HTMLElement>('[data-form-success], .form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    // Honeypot — silently mimic success.
    if (fd.get('company_field')) {
      if (successEl) {
        successEl.style.display = 'block';
        successEl.textContent = 'Thank you, your enquiry has been received.';
      }
      form.reset();
      return;
    }

    const draft = {
      id: newEnquiryId(),
      received: new Date().toISOString(),
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      programme: String(fd.get('programme') ?? 'General enquiry'),
      message: String(fd.get('message') ?? ''),
      consent: fd.get('consent') === 'on' || fd.get('consent') === 'true',
    };

    const parsed = EnquirySchema.safeParse(draft);
    if (!parsed.success) {
      if (successEl) {
        successEl.style.display = 'block';
        successEl.style.background = 'rgba(92,26,27,.08)';
        successEl.style.color = 'var(--accent)';
        successEl.style.borderLeftColor = 'var(--accent)';
        successEl.textContent = 'Please check the highlighted fields and try again.';
      }
      return;
    }

    track({ name: 'enquiry_submitted', programme: parsed.data.programme });

    if (successEl) {
      successEl.style.display = 'block';
      const firstName = parsed.data.name.split(' ')[0] || 'friend';
      successEl.innerHTML =
        `Thank you, <strong>${firstName}</strong>. ` +
        `Your enquiry has been received. We'll respond by email — usually within one working day. ` +
        `If urgent, write to <a href="mailto:admissions@mmbgims.com">admissions@mmbgims.com</a>.`;
    }
    form.reset();
  });
});
