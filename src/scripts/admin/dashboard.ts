/**
 * Admin dashboard controller.
 *
 * Source of truth is the server: every read goes through /api/admin/*,
 * every write through PATCH/POST/PUT. The session cookie travels with
 * each request automatically (`credentials: 'same-origin'`).
 */

import {
  type Application,
  type ApplicationStatus,
  type Enquiry,
  type ProgrammeId,
} from '~lib/schema';
import { formatINR, formatDate, formatDateShort } from '~lib/format';
import { PROGRAMME_LABEL, PAYMENT_METHOD_LABEL } from '~lib/payments/razorpay-mock';

const PROG_SHORT: Record<ProgrammeId, string> = {
  'MBA-BF': 'MBA · B&F',
  MMS: 'MMS',
  BMS: 'BMS',
  PHD: 'Ph.D.',
};

interface AppListResponse {
  applications: Application[];
  stats: {
    total: number;
    revenuePaise: number;
    todayPaise: number;
    byProgramme: Record<ProgrammeId, number>;
  };
}

interface EnqListResponse { enquiries: Enquiry[] }

interface AuditEntryView {
  id: number;
  actorEmail: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: number;
}
interface AuditResponse { entries: AuditEntryView[] }

const ACTION_LABELS: Record<string, string> = {
  'auth.login.success': 'signed in',
  'auth.login.failed': 'failed sign-in',
  'auth.login.invalid_input': 'invalid sign-in attempt',
  'auth.logout': 'signed out',
  'enquiry.received': 'enquiry received',
  'enquiry.status_changed': 'enquiry status updated',
  'application.submitted': 'application submitted',
  'application.status_changed': 'application status updated',
  'content.updated': 'content updated',
  'demo.seed': 'demo data seeded',
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: 'same-origin', ...init });
  if (res.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('unauthenticated');
  }
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── tabs ───
const tabs = document.querySelectorAll<HTMLElement>('.cms-tab');
const links = document.querySelectorAll<HTMLAnchorElement>('[data-tab]');
const titles: Record<string, string> = {
  dashboard: 'Overview', applications: 'Applications', enquiries: 'Enquiries',
  students: 'Students', pages: 'Pages', programs: 'Programmes',
  faculty: 'Faculty', events: 'Events', testimonials: 'Testimonials',
  payments: 'Payments', settings: 'Settings',
};
function setTab(name: string): void {
  tabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
  links.forEach((l) => l.classList.toggle('is-active', l.dataset.tab === name));
  const titleEl = document.getElementById('cmsTitle');
  if (titleEl) titleEl.textContent = titles[name] ?? 'Overview';
  if (history.replaceState) history.replaceState(null, '', '#' + name);
}
links.forEach((l) =>
  l.addEventListener('click', (e) => { e.preventDefault(); setTab(l.dataset.tab ?? 'dashboard'); }),
);
document.querySelectorAll<HTMLAnchorElement>('[data-tab-link]').forEach((l) =>
  l.addEventListener('click', (e) => { e.preventDefault(); setTab(l.dataset.tabLink ?? 'dashboard'); }),
);
if (location.hash && titles[location.hash.slice(1)]) setTab(location.hash.slice(1));

// ─── seed demo ───
document.getElementById('seedDemo')?.addEventListener('click', async (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  btn.disabled = true;
  btn.textContent = 'Seeding…';
  try {
    await fetchJson('/api/admin/seed-demo', { method: 'POST' });
    await render();
  } finally {
    btn.disabled = false;
    btn.textContent = 'Seed demo data';
  }
});

// ─── sign out ───
document.getElementById('signOut')?.addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
  window.location.href = '/admin/login';
});

// ─── render ───
function setText(id: string, text: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function esc(s: string): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}

async function render(): Promise<void> {
  const fProg = (document.getElementById('filterProg') as HTMLSelectElement | null)?.value ?? '';
  const fStat = (document.getElementById('filterStatus') as HTMLSelectElement | null)?.value ?? '';
  const params = new URLSearchParams();
  if (fProg) params.set('programme', fProg);
  if (fStat) params.set('status', fStat);

  const [appData, enqData, auditData] = await Promise.all([
    fetchJson<AppListResponse>(`/api/admin/applications?${params.toString()}`),
    fetchJson<EnqListResponse>('/api/admin/enquiries'),
    fetchJson<AuditResponse>('/api/admin/audit?limit=20').catch(() => ({ entries: [] })),
  ]);

  const apps = appData.applications;
  const enqs = enqData.enquiries;
  const stats = appData.stats;

  setText('kpiApps', String(stats.total));
  setText('kpiEnq', String(enqs.length));
  setText('appCountBadge', String(stats.total));
  setText('enqCountBadge', String(enqs.length));
  setText('kpiRevenue', formatINR(stats.revenuePaise / 100));

  const max = Math.max(...Object.values(stats.byProgramme), 1);
  const progBarsEl = document.getElementById('progBars');
  if (progBarsEl) {
    progBarsEl.innerHTML = (Object.keys(PROG_SHORT) as ProgrammeId[])
      .map((k) => {
        const v = stats.byProgramme[k] ?? 0;
        return `
        <div class="prog-bar">
          <div class="prog-bar__label"><span>${PROG_SHORT[k]}</span><strong>${v}</strong></div>
          <div class="prog-bar__track"><div class="prog-bar__fill" style="width:${(v / max) * 100}%"></div></div>
        </div>`;
      })
      .join('');
  }

  const recent = apps.slice(0, 5);
  const recentEl = document.getElementById('recentApps');
  if (recentEl) {
    recentEl.innerHTML =
      recent.length === 0
        ? '<li class="recent-list__empty">No applications yet.</li>'
        : recent.map((a) => `
        <li class="recent-list__item">
          <div>
            <strong>${esc(a.personal.firstName)} ${esc(a.personal.lastName)}</strong>
            <small>${PROG_SHORT[a.programme]} · ${esc(a.personal.email)}</small>
          </div>
          <time>${formatDateShort(a.submittedAt)}</time>
        </li>`).join('');
  }

  const tbody = document.getElementById('appsTable');
  if (tbody) {
    tbody.innerHTML =
      apps.length === 0
        ? '<tr><td colspan="7" class="cms-empty">No applications match the current filter.</td></tr>'
        : apps.map((a) => `
        <tr data-app-id="${esc(a.id)}">
          <td><code>${esc(a.id)}</code></td>
          <td><strong>${esc(a.personal.firstName)} ${esc(a.personal.lastName)}</strong><br><small>${esc(a.personal.email)}</small></td>
          <td>${PROG_SHORT[a.programme]}</td>
          <td>${formatDate(a.submittedAt)}</td>
          <td>${esc(a.amount)}</td>
          <td>
            <select class="status-select" data-app-id="${esc(a.id)}" aria-label="Change status">
              ${(['submitted','shortlisted','interviewed','offered','rejected'] as ApplicationStatus[])
                .map((s) => `<option value="${s}"${s === a.status ? ' selected' : ''}>${s}</option>`)
                .join('')}
            </select>
          </td>
          <td><a class="link-underline" href="mailto:${esc(a.personal.email)}">Email</a></td>
        </tr>`).join('');

    tbody.querySelectorAll<HTMLSelectElement>('.status-select').forEach((sel) => {
      sel.addEventListener('change', async () => {
        const id = sel.dataset.appId;
        const status = sel.value as ApplicationStatus;
        if (!id) return;
        try {
          await fetchJson(`/api/admin/applications?id=${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ status }),
          });
          await render();
        } catch (err) {
          console.error('status update failed', err);
          sel.value = sel.dataset.previous ?? sel.value;
        }
      });
    });
  }

  const enqEl = document.getElementById('enqTable');
  if (enqEl) {
    enqEl.innerHTML =
      enqs.length === 0
        ? '<tr><td colspan="6" class="cms-empty">No enquiries yet.</td></tr>'
        : enqs.map((e) => `
        <tr>
          <td>${formatDateShort(e.received)}</td>
          <td>${esc(e.name)}</td>
          <td>${esc(e.email)}</td>
          <td>${esc(e.programme)}</td>
          <td><small>${esc((e.message ?? '').slice(0, 80))}${(e.message ?? '').length > 80 ? '…' : ''}</small></td>
          <td><button class="btn btn--ghost btn--small">Reply</button></td>
        </tr>`).join('');
  }

  setText('payToday', formatINR(stats.todayPaise / 100));
  setText('payMonth', formatINR(stats.revenuePaise / 100));
  const payTable = document.getElementById('payTable');
  if (payTable) {
    payTable.innerHTML =
      apps.length === 0
        ? '<tr><td colspan="6" class="cms-empty">No payments yet.</td></tr>'
        : apps.map((a) => `
        <tr>
          <td><code>${esc(a.payment.id)}</code></td>
          <td>${esc(a.id)}</td>
          <td>${PAYMENT_METHOD_LABEL[a.payMethod]}</td>
          <td>${esc(a.amount)}</td>
          <td><span class="status-pill status-pill--enrolled">Captured</span></td>
          <td>${formatDate(a.submittedAt)}</td>
        </tr>`).join('');
  }

  // audit log
  const auditEl = document.getElementById('auditList');
  if (auditEl) {
    const entries = auditData.entries;
    auditEl.innerHTML =
      entries.length === 0
        ? '<li class="recent-list__empty">No audit entries yet.</li>'
        : entries
            .map((entry) => {
              const ts = new Date(entry.createdAt);
              const sameDay = ts.toDateString() === new Date().toDateString();
              const time = sameDay
                ? ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                : formatDateShort(ts);
              const actor = entry.actorEmail ?? 'public';
              const label = ACTION_LABELS[entry.action] ?? entry.action;
              const target = entry.targetId ? ` · <code>${esc(entry.targetId)}</code>` : '';
              return `<li><time>${esc(time)}</time><span><strong>${esc(actor)}</strong> ${esc(label)}${target}</span></li>`;
            })
            .join('');
  }
}

['filterProg', 'filterStatus'].forEach((id) =>
  document.getElementById(id)?.addEventListener('change', render),
);

// CSV export
document.getElementById('exportCsv')?.addEventListener('click', async () => {
  const data = await fetchJson<AppListResponse>('/api/admin/applications');
  if (!data.applications.length) {
    alert('No applications to export.');
    return;
  }
  const header = ['ID', 'First name', 'Last name', 'Email', 'Phone', 'Programme', 'Status', 'Amount', 'Submitted at'];
  const rows: string[][] = [header];
  data.applications.forEach((a) =>
    rows.push([
      a.id, a.personal.firstName, a.personal.lastName, a.personal.email, a.personal.phone,
      PROGRAMME_LABEL[a.programme], a.status, a.amount, a.submittedAt,
    ]),
  );
  const csv = rows.map((r) => r.map((c) => `"${(c ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'mmbgims-applications-' + new Date().toISOString().slice(0, 10) + '.csv';
  link.click();
  URL.revokeObjectURL(link.href);
});

// content draft
document.getElementById('saveContent')?.addEventListener('click', async () => {
  const payload = {
    eyebrow: (document.getElementById('edit-eyebrow') as HTMLInputElement | null)?.value ?? '',
    h1: (document.getElementById('edit-h1') as HTMLInputElement | null)?.value ?? '',
    lede: (document.getElementById('edit-lede') as HTMLTextAreaElement | null)?.value ?? '',
  };
  const msg = document.getElementById('saveMsg');
  try {
    await fetchJson('/api/admin/content?key=home_hero', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (msg) {
      msg.hidden = false;
      msg.textContent = '✓ Saved';
      setTimeout(() => (msg.hidden = true), 3500);
    }
  } catch (err) {
    if (msg) {
      msg.hidden = false;
      msg.textContent = '⚠ Save failed';
    }
    console.error(err);
  }
});

render();
