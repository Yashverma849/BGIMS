/**
 * Apply form payment + submission flow.
 *
 * 1. Recomputes fee + 18% GST live as the applicant picks a programme.
 * 2. On Pay click, gathers form values into an Application, validates with
 *    the shared zod ApplicationSchema, then triggers the payment gateway
 *    (currently the mocked Razorpay implementation).
 * 3. On gateway success, persists via `cms.saveApplication` and renders the
 *    receipt panel inside the modal.
 */

import { cms } from '~lib/cms';
import { razorpayMock, PAYMENT_METHOD_LABEL, PROGRAMME_LABEL } from '~lib/payments/razorpay-mock';
import {
  ApplicationSchema,
  newApplicationId,
  type Application,
  type ProgrammeId,
  type PaymentMethod,
} from '~lib/schema';
import { feeBreakdown, formatINRShort } from '~lib/format';
import { track } from '~lib/analytics';

const form = document.getElementById('applyForm') as HTMLFormElement | null;
if (form) {
  const feeEl = document.getElementById('pay-fee');
  const gstEl = document.getElementById('pay-gst');
  const totalEl = document.getElementById('pay-total');
  const payAmountEl = document.getElementById('payAmount');
  const rcptAmountEl = document.getElementById('rcptAmount');

  function updateFee(): void {
    const sel = document.querySelector<HTMLInputElement>(
      'input[name="programme"]:checked',
    );
    const base = sel ? Number(sel.dataset.fee ?? 1500) : 1500;
    const fb = feeBreakdown(base);
    if (feeEl) feeEl.textContent = fb.baseLabel;
    if (gstEl) gstEl.textContent = fb.gstLabel;
    if (totalEl) totalEl.textContent = fb.totalLabel;
    if (payAmountEl) payAmountEl.textContent = formatINRShort(fb.total);
    if (rcptAmountEl) rcptAmountEl.textContent = fb.totalLabel;
  }
  document
    .querySelectorAll<HTMLInputElement>('input[name="programme"]')
    .forEach((r) => r.addEventListener('change', updateFee));

  const payBtn = document.getElementById('payNow') as HTMLButtonElement | null;
  const modal = document.getElementById('rzpModal');
  const closeBtn = document.getElementById('rzpClose');
  const procEl = document.getElementById('rzpProcessing');
  const succEl = document.getElementById('rzpSuccess');
  const procMsg = document.getElementById('rzpProcessingMsg');

  function val(name: string): string {
    return ((form?.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '').toString();
  }

  payBtn?.addEventListener('click', async () => {
    const programmeRaw = val('programme') as ProgrammeId;
    if (!programmeRaw) {
      alert('Please pick a programme on Step 3 before paying.');
      return;
    }
    const sel = document.querySelector<HTMLInputElement>(
      'input[name="programme"]:checked',
    );
    const base = sel ? Number(sel.dataset.fee ?? 1500) : 1500;
    const fb = feeBreakdown(base);
    const method = val('payMethod') as PaymentMethod || 'upi';
    const id = newApplicationId();

    const draft = {
      id,
      submittedAt: new Date().toISOString(),
      personal: {
        firstName: val('firstName'),
        lastName: val('lastName'),
        email: val('email'),
        phone: val('phone'),
        dob: val('dob'),
        gender: val('gender'),
        address: val('address'),
        city: val('city'),
        state: val('state'),
        pin: val('pin'),
      },
      academic: {
        x_board: val('x_board'),
        x_year: val('x_year') || '0',
        x_score: val('x_score'),
        xii_board: val('xii_board'),
        xii_year: val('xii_year') || '0',
        xii_score: val('xii_score'),
        ug_university: val('ug_university'),
        ug_programme: val('ug_programme'),
        ug_score: val('ug_score'),
        entrance_test: val('entrance_test'),
        entrance_year: val('entrance_year'),
        entrance_score: val('entrance_score'),
      },
      programme: programmeRaw,
      sop: val('sop'),
      ref_name: val('ref_name'),
      ref_email: val('ref_email'),
      payMethod: method,
      amount: fb.totalLabel,
      status: 'submitted' as const,
      payment: {
        id: 'pending',
        method,
        amount: fb.totalLabel,
        capturedAt: new Date().toISOString(),
      },
    };

    const parsed = ApplicationSchema.safeParse(draft);
    if (!parsed.success) {
      console.warn('Application validation failed', parsed.error.issues);
      const issue = parsed.error.issues[0];
      alert(
        `Please complete all required fields. Missing: ${issue.path.join('.')} — ${issue.message}`,
      );
      return;
    }

    modal?.classList.add('is-open');
    if (procEl) procEl.hidden = false;
    if (succEl) succEl.hidden = true;
    if (procMsg) procMsg.textContent = 'Connecting to Razorpay…';

    const result = await razorpayMock.charge(
      {
        amountInPaise: fb.total * 100,
        currency: 'INR',
        description: `MM BGIMS application · ${PROGRAMME_LABEL[programmeRaw]}`,
        applicationId: id,
      },
      method,
      {
        onProgress(msg) {
          if (procMsg) procMsg.textContent = msg;
        },
      },
    );

    const application: Application = {
      ...parsed.data,
      payment: {
        id: result.paymentId,
        method: result.method,
        amount: result.amountLabel,
        capturedAt: result.capturedAt,
      },
    };
    cms.saveApplication(application);
    track({
      name: 'payment_captured',
      programme: programmeRaw,
      amountInRupees: fb.total,
    });

    if (procEl) procEl.hidden = true;
    if (succEl) succEl.hidden = false;
    set('appId', application.id);
    set('rcptPayId', application.payment.id);
    set('rcptMethod', PAYMENT_METHOD_LABEL[application.payMethod]);
    set('rcptProg', PROGRAMME_LABEL[programmeRaw]);
    if (rcptAmountEl) rcptAmountEl.textContent = application.payment.amount;
  });

  function set(id: string, text: string): void {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  closeBtn?.addEventListener('click', () => modal?.classList.remove('is-open'));
  modal
    ?.querySelector<HTMLElement>('.rzp-modal__backdrop')
    ?.addEventListener('click', () => modal.classList.remove('is-open'));

  // initial fee compute
  updateFee();
}
