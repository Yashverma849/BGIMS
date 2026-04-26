/**
 * Admin /login client behaviour:
 *  - show/hide password toggle
 *  - intercept submit, POST credentials to /api/auth/login, redirect on success
 *  - render the API's error reason in the inline error block
 */

import { LoginSchema } from '~lib/schema';

const form = document.getElementById('loginForm') as HTMLFormElement | null;
const pwdInput = document.getElementById('login-password') as HTMLInputElement | null;
const emailInput = document.getElementById('login-email') as HTMLInputElement | null;
const errEl = document.getElementById('loginError');
const toggle = document.getElementById('pwdToggle') as HTMLButtonElement | null;

toggle?.addEventListener('click', () => {
  if (!pwdInput) return;
  const next = pwdInput.type === 'password' ? 'text' : 'password';
  pwdInput.type = next;
  toggle.textContent = next === 'text' ? 'hide' : 'show';
});

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!emailInput || !pwdInput) return;

  const draft = { email: emailInput.value.trim().toLowerCase(), password: pwdInput.value };
  const parsed = LoginSchema.safeParse(draft);
  if (!parsed.success) {
    if (errEl) {
      errEl.hidden = false;
      errEl.textContent = 'Email or password looks malformed.';
    }
    return;
  }

  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const originalText = submit?.innerHTML;
  if (submit) {
    submit.disabled = true;
    submit.textContent = 'Signing in…';
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(parsed.data),
      credentials: 'same-origin',
    });
    if (res.ok) {
      const next = form.dataset.next || '/admin/dashboard';
      window.location.href = next;
      return;
    }
    if (errEl) {
      errEl.hidden = false;
      errEl.textContent =
        res.status === 429
          ? 'Too many sign-in attempts. Try again in a minute.'
          : "Those credentials don't match anything on record.";
    }
  } catch (err) {
    console.error(err);
    if (errEl) {
      errEl.hidden = false;
      errEl.textContent = 'Network error. Check your connection and try again.';
    }
  } finally {
    if (submit) {
      submit.disabled = false;
      if (originalText) submit.innerHTML = originalText;
    }
  }
});
