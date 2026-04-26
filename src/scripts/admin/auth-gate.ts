/**
 * Client-side auth gate for admin pages. If no session is found in
 * localStorage, redirects to /admin/login. Cheap, transparent, and good
 * enough for a non-public CMS — when we move to real auth it will be
 * superseded by middleware on the server.
 */

import { clientMockAuth } from '~lib/auth/client-mock';

const session = clientMockAuth.current();
if (!session) {
  window.location.href = '/admin/login';
} else {
  document.documentElement.setAttribute('data-session', session.role);
  const initial = session.email.charAt(0).toUpperCase();
  const avatar = document.getElementById('userAvatar');
  const nameEl = document.getElementById('userName');
  const emailEl = document.getElementById('userEmail');
  if (avatar) avatar.textContent = initial;
  if (nameEl) nameEl.textContent = session.role || 'Staff';
  if (emailEl) emailEl.textContent = session.email;
}

document.getElementById('signOut')?.addEventListener('click', () => {
  clientMockAuth.signOut();
  window.location.href = '/admin/login';
});
