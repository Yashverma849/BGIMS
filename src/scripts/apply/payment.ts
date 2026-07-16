/**
 * Apply form payment, layout transitions, validations, and step-by-step draft saving via server proxy.
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
  const steps = Array.from(form.querySelectorAll<HTMLElement>('.apply-step'));
  const stepperItems = Array.from(document.querySelectorAll<HTMLElement>('.stepper__item'));
  const applySection = document.querySelector<HTMLElement>('.apply-section');

  const feeEl = document.getElementById('pay-fee');
  const gstEl = document.getElementById('pay-gst');
  const totalEl = document.getElementById('pay-total');
  const payAmountEl = document.getElementById('payAmount');
  const rcptAmountEl = document.getElementById('rcptAmount');

  const payBtn = document.getElementById('payNow') as HTMLButtonElement | null;
  const modal = document.getElementById('rzpModal');
  const closeBtn = document.getElementById('rzpClose');
  const procEl = document.getElementById('rzpProcessing');
  const succEl = document.getElementById('rzpSuccess');
  const procMsg = document.getElementById('rzpProcessingMsg');

  // Holds paths of uploaded documents
  const uploadedDocs: Record<string, string> = {};

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

  function val(name: string): string {
    return ((form?.elements.namedItem(name) as HTMLInputElement | null)?.value ?? '').toString().trim();
  }

  function getOrGenerateAppId(): string {
    let id = sessionStorage.getItem('current_app_id');
    if (!id) {
      id = newApplicationId();
      sessionStorage.setItem('current_app_id', id);
    }
    return id;
  }

  function goToStep(n: string | number): void {
    const target = String(n);
    steps.forEach((s) =>
      s.classList.toggle('is-active', s.dataset.step === target)
    );
    stepperItems.forEach((s) => {
      s.classList.toggle('is-active', s.dataset.step === target);
      s.classList.toggle(
        'is-done',
        Number(s.dataset.step ?? 0) < Number(target)
      );
    });
    if (applySection) {
      window.scrollTo({
        top: applySection.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  }

  async function uploadDocument(applicationId: string, docName: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('applicationId', applicationId);
    formData.append('docName', docName);

    const res = await fetch('/api/applications/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Upload failed: ${errText}`);
    }

    const json = await res.json();
    return json.path;
  }

  // Hook change event listeners to files to upload immediately on selection
  const fileInputs = form.querySelectorAll<HTMLInputElement>('input[type="file"]');
  fileInputs.forEach((input) => {
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;

      const docName = input.name || 'document';
      const id = getOrGenerateAppId();
      const tile = input.closest('.upload-tile');

      if (tile) {
        tile.classList.add('is-uploading');
        tile.classList.remove('is-uploaded');
      }

      try {
        const docPath = await uploadDocument(id, docName, file);
        uploadedDocs[docName] = docPath;

        if (tile) {
          tile.classList.remove('is-uploading');
          tile.classList.add('is-uploaded');
          
          const small = tile.querySelector('small');
          if (small) {
            small.textContent = `✅ ${file.name}`;
            small.style.color = '#2e7d32';
          }
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}`, err);
        alert(`Failed to upload ${file.name}: ${err instanceof Error ? err.message : String(err)}. Please try again.`);
        if (tile) {
          tile.classList.remove('is-uploading');
        }
      }
    });
  });

  async function handleStepSave(stepNum: number): Promise<boolean> {
    const id = getOrGenerateAppId();
    let data: any = {};

    if (stepNum === 1) {
      // Validate Step 1 (Personal details)
      data = {
        first_name: val('firstName'),
        last_name: val('lastName'),
        email: val('email'),
        phone: val('phone'),
        dob: val('dob'),
        gender: val('gender'),
        address: val('address'),
        city: val('city'),
        state: val('state'),
        pin: val('pin'),
      };

      if (!data.first_name || !data.last_name || !data.email || !data.phone || !data.dob || !data.gender || !data.address || !data.city || !data.state || !data.pin) {
        alert('Please fill out all required personal details before continuing.');
        return false;
      }
      if (!/^\d{6}$/.test(data.pin)) {
        alert('PIN code must be exactly 6 digits.');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        alert('Please enter a valid email address.');
        return false;
      }
    } else if (stepNum === 2) {
      // Validate Step 2 (Academic details)
      data = {
        x_board: val('x_board'),
        x_year: val('x_year'),
        x_score: val('x_score'),
        xii_board: val('xii_board'),
        xii_year: val('xii_year'),
        xii_score: val('xii_score'),
        ug_university: val('ug_university'),
        ug_programme: val('ug_programme'),
        ug_score: val('ug_score'),
        entrance_test: val('entrance_test'),
        entrance_year: val('entrance_year'),
        entrance_score: val('entrance_score'),
      };

      if (!data.x_board || !data.x_year || !data.x_score || !data.xii_board || !data.xii_year || !data.xii_score) {
        alert('Please fill out all required high school boards, years, and scores.');
        return false;
      }
    } else if (stepNum === 3) {
      // Validate Step 3 (Programme selection)
      const programmeRaw = val('programme');
      if (!programmeRaw) {
        alert('Please select a programme choice.');
        return false;
      }
      data = {
        programme_id: programmeRaw,
        sop: val('sop'),
        status: 'draft',
      };
    } else if (stepNum === 4) {
      // Step 4 (Documents & References validation)
      // Check that required documents (X and XII marksheet) are already uploaded
      if (!uploadedDocs['doc_class_x']) {
        alert('Please upload your Class X marksheet before continuing.');
        return false;
      }
      if (!uploadedDocs['doc_class_xii']) {
        alert('Please upload your Class XII marksheet before continuing.');
        return false;
      }

      const ref_name = val('ref_name') || null;
      const ref_email = val('ref_email') || null;

      if (ref_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref_email)) {
        alert('Please enter a valid referee email address.');
        return false;
      }

      data = {
        ref_name,
        ref_email,
        documents: uploadedDocs,
      };
    }

    // Call the local server proxy route
    const res = await fetch('/api/applications/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step: stepNum,
        applicationId: id,
        data,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Network request failed');
    }
    return true;
  }

  // Hook into Continue buttons for step-by-step validation & database auto-saving
  document.querySelectorAll<HTMLButtonElement>('[data-next]').forEach((b) => {
    b.addEventListener('click', async (e) => {
      e.preventDefault();
      const nextStep = b.dataset.next ?? '1';
      const currentStep = Number(nextStep) - 1;

      const originalText = b.innerHTML;
      b.disabled = true;
      b.innerHTML = `Saving...`;

      try {
        const success = await handleStepSave(currentStep);
        if (success) {
          goToStep(nextStep);
        }
      } catch (err) {
        console.error(`Step ${currentStep} save failed`, err);
        alert(`Failed to save draft progress: ${err instanceof Error ? err.message : String(err)}. Please try again.`);
      } finally {
        b.disabled = false;
        b.innerHTML = originalText;
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-prev]').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      goToStep(b.dataset.prev ?? '1');
    });
  });

  // Step 5 - Final Payment
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
    const id = getOrGenerateAppId();

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

    if (procEl) procEl.hidden = false;
    if (succEl) succEl.hidden = true;
    if (procMsg) procMsg.textContent = 'Recording transaction…';

    try {
      // 1. Insert transaction details and promote status to submitted via server draft route
      const res = await fetch('/api/applications/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 5,
          applicationId: id,
          data: {
            paymentId: application.payment.id,
            amount: application.payment.amount,
            method: application.payment.method,
            capturedAt: application.payment.capturedAt,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to save final status');
      }

      // 2. Sync to local backend database (logs, emails)
      await cms.saveApplication(application);
    } catch (err) {
      console.error('Final transaction sync failed', err);
    }

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

    // Clear session state
    sessionStorage.removeItem('current_app_id');
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
