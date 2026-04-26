/**
 * Contact-page enquiry form handler.
 *
 * Validates client-side via the shared EnquirySchema, then POSTs through
 * the cms adapter to /api/enquiries (DB-backed). Renders a success or
 * error message inline; tells the user about rate limits explicitly.
 */

import { cms } from '~lib/cms';
import { EnquirySchema, newEnquiryId, type Enquiry } from '~lib/schema';
import { track } from '~lib/analytics';

document.querySelectorAll<HTMLFormElement>('[data-form="enquiry"]').forEach((form) => {
  const successEl = form.querySelector<HTMLElement>('[data-form-success], .form-success');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    // Honeypot — silently drop bot submissions and mimic success so they
    // don't retry. Real users never see this field.
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
      console.warn('Enquiry validation failed', parsed.error.issues);
      if (successEl) {
        successEl.style.display = 'block';
        successEl.style.background = 'rgba(92,26,27,.08)';
        successEl.style.color = 'var(--accent)';
        successEl.style.borderLeftColor = 'var(--accent)';
        successEl.textContent = 'Please check the highlighted fields and try again.';
      }
      return;
    }

    const enquiry: Enquiry = parsed.data;
    const originalText = submit?.innerHTML;
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }

    try {
      await Promise.resolve(cms.saveEnquiry(enquiry));
      track({ name: 'enquiry_submitted', programme: enquiry.programme });

      if (successEl) {
        successEl.style.display = 'block';
        const firstName = enquiry.name.split(' ')[0] || 'friend';
        successEl.innerHTML = `Thank you, <strong>${firstName}</strong>. Your enquiry (<strong>${enquiry.id}</strong>) has been received. Our admissions office will reach out within 1 business day.`;
      }
      form.reset();
    } catch (err) {
      console.error('saveEnquiry failed', err);
      if (successEl) {
        successEl.style.display = 'block';
        successEl.style.background = 'rgba(92,26,27,.08)';
        successEl.style.color = 'var(--accent)';
        successEl.style.borderLeftColor = 'var(--accent)';
        const message = String(err);
        successEl.textContent = message.includes('429')
          ? 'Too many enquiries from this address. Please try again in a minute.'
          : "Sorry, your enquiry could not be sent right now. Please email admissions@mmbgims.com.";
      }
    } finally {
      if (submit) {
        submit.disabled = false;
        if (originalText) submit.innerHTML = originalText;
      }
    }
  });
});
