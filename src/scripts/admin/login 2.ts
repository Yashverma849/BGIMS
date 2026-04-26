/** Admin /login: show/hide password + mock-auth submit. */

import { clientMockAuth } from '~lib/auth/client-mock';
import { LoginSchema } from '~lib/schema';
import { track } from '~lib/analytics';

const pwdInput = document.getElementById('login-password') as HTMLInputElement | null;
const toggle = document.getElementById('pwdToggle') as HTMLButtonElement | null;

toggle?.addEventListener('click', () => {
  if (!pwdInput) return;
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    toggle.textContent = 'hide';
  } else {
    pwdInput.type = 'password';
    toggle.textContent = 'show';
  }
});

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailEl = document.getElementById('login-email') as HTMLInputElement | null;
  const errEl = document.getElementById('loginError');
  if (!emailEl || !pwdInput) return;

  const parsed = LoginSchema.safeParse({
    email: emailEl.value.trim().toLowerCase(),
    password: pwdInput.value,
  });
  if (!parsed.success) {
    if (errEl) errEl.hidden = false;
    return;
  }
  const session = clientMockAuth.signIn(parsed.data);
  if (!session) {
    if (errEl) errEl.hidden = false;
    return;
  }
  track({ name: 'admin_signed_in' });
  const submit = (e.target as HTMLFormElement).querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  if (submit) submit.textContent = 'Signing in…';
  setTimeout(() => {
    window.location.href = '/admin/dashboard';
  }, 600);
});
