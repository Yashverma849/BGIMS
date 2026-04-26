/**
 * Admin dashboard client (placeholder mode).
 *
 * Auth + DB are currently disabled. This script wires the tab switcher
 * + sign-out button (which redirects to /admin/login) and shows
 * "Backend not connected" empty states everywhere data would normally
 * appear. Re-enable per the comment block in astro.config.mjs.
 */

const tabs = document.querySelectorAll<HTMLElement>('.cms-tab');
const links = document.querySelectorAll<HTMLAnchorElement>('[data-tab]');
const titles: Record<string, string> = {
  dashboard: 'Overview',
  applications: 'Applications',
  enquiries: 'Enquiries',
  students: 'Students',
  pages: 'Pages',
  programs: 'Programmes',
  faculty: 'Faculty',
  events: 'Events',
  testimonials: 'Testimonials',
  payments: 'Payments',
  settings: 'Settings',
};

function setTab(name: string): void {
  tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
  links.forEach((l) => l.classList.toggle('is-active', l.dataset.tab === name));
  const titleEl = document.getElementById('cmsTitle');
  if (titleEl) titleEl.textContent = titles[name] ?? 'Overview';
  if (history.replaceState) history.replaceState(null, '', '#' + name);
}
links.forEach((l) =>
  l.addEventListener('click', (e) => {
    e.preventDefault();
    setTab(l.dataset.tab ?? 'dashboard');
  }),
);
document.querySelectorAll<HTMLAnchorElement>('[data-tab-link]').forEach((l) =>
  l.addEventListener('click', (e) => {
    e.preventDefault();
    setTab(l.dataset.tabLink ?? 'dashboard');
  }),
);
if (location.hash && titles[location.hash.slice(1)]) setTab(location.hash.slice(1));

document.getElementById('signOut')?.addEventListener('click', () => {
  window.location.href = '/admin/login';
});

function emptyTable(id: string, cols: number, label: string): void {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<tr><td colspan="${cols}" class="cms-empty">${label}</td></tr>`;
}
function emptyList(id: string, label: string): void {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<li class="recent-list__empty">${label}</li>`;
}
function setText(id: string, text: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

const NOT_CONNECTED = 'Backend not connected — sample data shown when CMS is enabled.';

setText('kpiApps', '—');
setText('kpiEnq', '—');
setText('kpiRevenue', '—');
setText('appCountBadge', '—');
setText('enqCountBadge', '—');
setText('payToday', '—');
setText('payMonth', '—');

emptyTable('appsTable', 7, NOT_CONNECTED);
emptyTable('enqTable', 6, NOT_CONNECTED);
emptyTable('payTable', 6, NOT_CONNECTED);
emptyList('recentApps', NOT_CONNECTED);
emptyList('auditList', NOT_CONNECTED);

(['seedDemo', 'exportCsv', 'saveContent'] as const).forEach((id) => {
  const btn = document.getElementById(id) as HTMLButtonElement | null;
  if (btn) {
    btn.disabled = true;
    btn.title = 'Disabled — backend not connected';
  }
});
