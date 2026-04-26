/**
 * Admin /login client script (placeholder mode).
 *
 * Auth is currently disabled. The submit handler displays a message
 * explaining this and does NOT contact any API. Re-enable per the comment
 * block in astro.config.mjs.
 */

const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
const pwdInput = document.getElementById('login-password') as HTMLInputElement | null;
const errEl = document.getElementById('loginError');
const toggle = document.getElementById('pwdToggle') as HTMLButtonElement | null;

toggle?.addEventListener('click', () => {
  if (!pwdInput) return;
  const next = pwdInput.type === 'password' ? 'text' : 'password';
  pwdInput.type = next;
  toggle.textContent = next === 'text' ? 'hide' : 'show';
});

loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (errEl) {
    errEl.hidden = false;
    errEl.innerHTML =
      'Sign-in is currently disabled. The CMS will be enabled in the next release; ' +
      'in the meantime please write to <a href="mailto:office@mmbgims.com">office@mmbgims.com</a>.';
  }
});
