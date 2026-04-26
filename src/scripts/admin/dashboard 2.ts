/**
 * Admin dashboard controller. Reads applications + enquiries from the cms
 * adapter and renders KPIs, recent lists, programme bars, and tables. The
 * "Seed demo data" and "Export CSV" actions are wired here.
 *
 * Data flow is one-way: the adapter is the source of truth; render() rewrites
 * the DOM each time filters change.
 */

import { cms } from '~lib/cms';
import {
  newApplicationId,
  newPaymentId,
  type Application,
  type ApplicationStatus,
  type Enquiry,
  type PaymentMethod,
  type ProgrammeId,
} from '~lib/schema';
import { formatINR, formatDate, formatDateShort } from '~lib/format';
import { PROGRAMME_LABEL, PAYMENT_METHOD_LABEL } from '~lib/payments/razorpay-mock';

const STATUS_PILL: Record<ApplicationStatus, string> = {
  submitted: 'status-pill--pending',
  shortlisted: 'status-pill--shortlisted',
  interviewed: 'status-pill--interviewed',
  offered: 'status-pill--offered',
  rejected: 'status-pill--rejected',
};

const PROG_SHORT: Record<ProgrammeId, string> = {
  'MBA-BF': 'MBA · B&F',
  MMS: 'MMS',
  BMS: 'BMS',
  PHD: 'Ph.D.',
};

// ────────── tab switching ──────────
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
document
  .querySelectorAll<HTMLAnchorElement>('[data-tab-link]')
  .forEach((l) =>
    l.addEventListener('click', (e) => {
      e.preventDefault();
      setTab(l.dataset.tabLink ?? 'dashboard');
    }),
  );
if (location.hash && titles[location.hash.slice(1)]) {
  setTab(location.hash.slice(1));
}

// ────────── seed demo data ──────────
function seedDemo(): void {
  const sample: Array<{
    firstName: string;
    lastName: string;
    email: string;
    programme: ProgrammeId;
    status: ApplicationStatus;
  }> = [
    { firstName: 'Aanya', lastName: 'Iyer', email: 'aanya.iyer@gmail.com', programme: 'MBA-BF', status: 'shortlisted' },
    { firstName: 'Karan', lastName: 'Kothari', email: 'karan.k@outlook.com', programme: 'MBA-BF', status: 'interviewed' },
    { firstName: 'Riya', lastName: 'Bhatt', email: 'riya.b@yahoo.com', programme: 'MMS', status: 'submitted' },
    { firstName: 'Aniket', lastName: 'Patil', email: 'aniket.p@gmail.com', programme: 'BMS', status: 'offered' },
    { firstName: 'Tanvi', lastName: 'Shah', email: 'tanvi.shah@gmail.com', programme: 'MMS', status: 'shortlisted' },
    { firstName: 'Kabir', lastName: 'Joshi', email: 'kabir.j@protonmail.com', programme: 'MBA-BF', status: 'submitted' },
    { firstName: 'Sneha', lastName: 'Gupta', email: 'sneha.gupta@gmail.com', programme: 'BMS', status: 'submitted' },
    { firstName: 'Vikram', lastName: 'Mehra', email: 'vikram.m@outlook.com', programme: 'PHD', status: 'interviewed' },
    { firstName: 'Pooja', lastName: 'Reddy', email: 'pooja.r@gmail.com', programme: 'MMS', status: 'submitted' },
    { firstName: 'Arjun', lastName: 'Nair', email: 'arjun.n@yahoo.com', programme: 'MBA-BF', status: 'rejected' },
    { firstName: 'Meera', lastName: 'Desai', email: 'meera.d@gmail.com', programme: 'MMS', status: 'shortlisted' },
    { firstName: 'Rohan', lastName: 'Saxena', email: 'rohan.s@gmail.com', programme: 'BMS', status: 'submitted' },
  ];
  const fees: Record<ProgrammeId, number> = {
    'MBA-BF': 1770,
    MMS: 1770,
    BMS: 1180,
    PHD: 2950,
  };
  const methods: PaymentMethod[] = ['upi', 'card', 'netbanking', 'wallet'];
  const apps: Application[] = sample.map((s, i) => {
    const fee = fees[s.programme];
    const method = methods[i % methods.length];
    const submittedAt = new Date(Date.now() - i * 86400000).toISOString();
    return {
      id: newApplicationId(Date.now() - i * 86400000),
      submittedAt,
      personal: {
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        phone: '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
        dob: '2002-01-01',
        gender: 'Prefer not to say',
        address: 'Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        pin: '400008',
      },
      academic: {
        x_board: 'Maharashtra State Board',
        x_year: 2018,
        x_score: '88%',
        xii_board: 'CBSE',
        xii_year: 2020,
        xii_score: '90%',
        ug_university: 'University of Mumbai',
        ug_programme: 'B.Com',
        ug_score: '8.5 CGPA',
        entrance_test: 'CAT',
        entrance_year: 2025,
        entrance_score: '92%ile',
      },
      programme: s.programme,
      sop: '',
      ref_name: '',
      ref_email: '',
      payMethod: method,
      amount: formatINR(fee),
      status: s.status,
      payment: {
        id: newPaymentId(),
        method,
        amount: formatINR(fee),
        capturedAt: submittedAt,
      },
    };
  });
  cms.setApplications(apps);

  const enqs: Enquiry[] = [
    {
      id: 'ENQ-DEMO-1',
      received: new Date().toISOString(),
      name: 'Aditi Kale',
      email: 'aditi.k@gmail.com',
      programme: 'MBA · Banking & Finance',
      message: 'Looking for early decision details and scholarship opportunities.',
      phone: '',
    },
    {
      id: 'ENQ-DEMO-2',
      received: new Date(Date.now() - 86400000).toISOString(),
      name: 'Arnav Singh',
      email: 'arnav.s@outlook.com',
      programme: 'BMS',
      message: 'Class XII candidate. Could you share the prospectus?',
      phone: '',
    },
    {
      id: 'ENQ-DEMO-3',
      received: new Date(Date.now() - 86400000 * 2).toISOString(),
      name: 'Neha Pillai',
      email: 'n.pillai@gmail.com',
      programme: 'MMS',
      message: 'Working professional, two years experience. Eligibility query.',
      phone: '',
    },
    {
      id: 'ENQ-DEMO-4',
      received: new Date(Date.now() - 86400000 * 3).toISOString(),
      name: 'Rishi Kapur',
      email: 'rishi.k@gmail.com',
      programme: 'Ph.D.',
      message: 'Research interest in behavioural finance. May I speak with the doctoral committee?',
      phone: '',
    },
  ];
  cms.setEnquiries(enqs);
  render();
}
document.getElementById('seedDemo')?.addEventListener('click', seedDemo);

// ────────── render ──────────
function amountToNumber(label: string): number {
  return Number(label.replace(/[^0-9]/g, '')) || 0;
}

function render(): void {
  const apps = cms.listApplications();
  const enqs = cms.listEnquiries();

  // KPIs + nav badges
  setText('kpiApps', String(apps.length));
  setText('kpiEnq', String(enqs.length));
  setText('appCountBadge', String(apps.length));
  setText('enqCountBadge', String(enqs.length));
  const revenue = apps.reduce((s, a) => s + amountToNumber(a.amount), 0);
  setText('kpiRevenue', formatINR(revenue));

  // programme bars
  const counts: Record<ProgrammeId, number> = { 'MBA-BF': 0, MMS: 0, BMS: 0, PHD: 0 };
  apps.forEach((a) => {
    counts[a.programme] = (counts[a.programme] ?? 0) + 1;
  });
  const max = Math.max(...Object.values(counts), 1);
  const progBarsEl = document.getElementById('progBars');
  if (progBarsEl) {
    progBarsEl.innerHTML = Object.entries(counts)
      .map(
        ([k, v]) => `
      <div class="prog-bar">
        <div class="prog-bar__label"><span>${PROG_SHORT[k as ProgrammeId]}</span><strong>${v}</strong></div>
        <div class="prog-bar__track"><div class="prog-bar__fill" style="width:${(v / max) * 100}%"></div></div>
      </div>`,
      )
      .join('');
  }

  // recent
  const recent = apps.slice(-5).reverse();
  const recentEl = document.getElementById('recentApps');
  if (recentEl) {
    recentEl.innerHTML =
      recent.length === 0
        ? '<li class="recent-list__empty">No applications yet.</li>'
        : recent
            .map(
              (a) => `
        <li class="recent-list__item">
          <div>
            <strong>${a.personal.firstName} ${a.personal.lastName}</strong>
            <small>${PROG_SHORT[a.programme]} · ${a.personal.email}</small>
          </div>
          <time>${formatDateShort(a.submittedAt)}</time>
        </li>`,
            )
            .join('');
  }

  // applications table (with filters)
  const fProg = (document.getElementById('filterProg') as HTMLSelectElement | null)?.value ?? '';
  const fStat = (document.getElementById('filterStatus') as HTMLSelectElement | null)?.value ?? '';
  const filtered = apps.filter(
    (a) => (!fProg || a.programme === fProg) && (!fStat || a.status === fStat),
  );
  const tbody = document.getElementById('appsTable');
  if (tbody) {
    tbody.innerHTML =
      filtered.length === 0
        ? '<tr><td colspan="7" class="cms-empty">No applications match the current filter.</td></tr>'
        : filtered
            .map(
              (a) => `
        <tr>
          <td><code>${a.id}</code></td>
          <td><strong>${a.personal.firstName} ${a.personal.lastName}</strong><br><small>${a.personal.email}</small></td>
          <td>${PROG_SHORT[a.programme]}</td>
          <td>${formatDate(a.submittedAt)}</td>
          <td>${a.amount}</td>
          <td><span class="status-pill ${STATUS_PILL[a.status] ?? ''}">${a.status}</span></td>
          <td><button class="btn btn--ghost btn--small">View</button></td>
        </tr>`,
            )
            .join('');
  }

  // enquiries
  const enqEl = document.getElementById('enqTable');
  if (enqEl) {
    enqEl.innerHTML =
      enqs.length === 0
        ? '<tr><td colspan="6" class="cms-empty">No enquiries yet.</td></tr>'
        : enqs
            .map(
              (e) => `
        <tr>
          <td>${formatDateShort(e.received)}</td>
          <td>${e.name}</td>
          <td>${e.email}</td>
          <td>${e.programme}</td>
          <td><small>${(e.message ?? '').slice(0, 80)}${(e.message ?? '').length > 80 ? '…' : ''}</small></td>
          <td><button class="btn btn--ghost btn--small">Reply</button></td>
        </tr>`,
            )
            .join('');
  }

  // payments
  const today = new Date().toDateString();
  const todayTotal = apps
    .filter((a) => new Date(a.submittedAt).toDateString() === today)
    .reduce((s, a) => s + amountToNumber(a.amount), 0);
  setText('payToday', formatINR(todayTotal));
  setText('payMonth', formatINR(revenue));

  const payTable = document.getElementById('payTable');
  if (payTable) {
    payTable.innerHTML =
      apps.length === 0
        ? '<tr><td colspan="6" class="cms-empty">No payments yet.</td></tr>'
        : apps
            .slice()
            .reverse()
            .map(
              (a) => `
        <tr>
          <td><code>${a.payment.id}</code></td>
          <td>${a.id}</td>
          <td>${PAYMENT_METHOD_LABEL[a.payMethod]}</td>
          <td>${a.amount}</td>
          <td><span class="status-pill status-pill--enrolled">Captured</span></td>
          <td>${formatDate(a.submittedAt)}</td>
        </tr>`,
            )
            .join('');
  }
}

function setText(id: string, text: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

['filterProg', 'filterStatus'].forEach((id) =>
  document.getElementById(id)?.addEventListener('change', render),
);

// ────────── CSV export ──────────
document.getElementById('exportCsv')?.addEventListener('click', () => {
  const apps = cms.listApplications();
  if (!apps.length) {
    alert('No applications to export.');
    return;
  }
  const header = ['ID', 'First name', 'Last name', 'Email', 'Phone', 'Programme', 'Status', 'Amount', 'Submitted at'];
  const rows = [header];
  apps.forEach((a) =>
    rows.push([
      a.id,
      a.personal.firstName,
      a.personal.lastName,
      a.personal.email,
      a.personal.phone,
      PROGRAMME_LABEL[a.programme],
      a.status,
      a.amount,
      a.submittedAt,
    ]),
  );
  const csv = rows
    .map((r) => r.map((c) => `"${(c ?? '').toString().replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'mmbgims-applications-' + new Date().toISOString().slice(0, 10) + '.csv';
  link.click();
  URL.revokeObjectURL(link.href);
});

// ────────── content draft (home hero edit) ──────────
document.getElementById('saveContent')?.addEventListener('click', () => {
  cms.setContentDraft({
    eyebrow: (document.getElementById('edit-eyebrow') as HTMLInputElement | null)?.value ?? '',
    h1: (document.getElementById('edit-h1') as HTMLInputElement | null)?.value ?? '',
    lede: (document.getElementById('edit-lede') as HTMLTextAreaElement | null)?.value ?? '',
  });
  const msg = document.getElementById('saveMsg');
  if (msg) {
    msg.hidden = false;
    setTimeout(() => (msg.hidden = true), 3500);
  }
});

render();
