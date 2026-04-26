/**
 * Contact-page enquiry form handler. Validates client-side via the shared
 * EnquirySchema, then writes through the cms adapter (localStorage by
 * default, /api/enquiries when PUBLIC_USE_SERVER_API=true).
 *
 * Renders a success message in `[data-form-success]` and resets the form.
 */

import { cms } from '~lib/cms';
import { EnquirySchema, newEnquiryId, type Enquiry } from '~lib/schema';
import { track } from '~lib/analytics';

document.querySelectorAll<HTMLFormElement>('[data-form="enquiry"]').forEach((form) => {
  const successEl = form.querySelector<HTMLElement>('[data-form-success], .form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
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
      return;
    }
    const enquiry: Enquiry = parsed.data;
    cms.saveEnquiry(enquiry);
    track({ name: 'enquiry_submitted', programme: enquiry.programme });

    if (successEl) {
      successEl.style.display = 'block';
      const firstName = enquiry.name.split(' ')[0] || 'friend';
      successEl.innerHTML = `Thank you, <strong>${firstName}</strong>. Your enquiry (<strong>${enquiry.id}</strong>) has been received. Our admissions office will reach out within 1 business day.`;
    }
    form.reset();
  });
});
