/**
 * POST /api/admin/seed-demo — populates 12 sample applications + 4 enquiries
 * for demoing the dashboard. Wipes existing rows first so the dashboard
 * always reflects exactly the seed.
 *
 * Auth-gated (Director or Staff). Audit-logged.
 */

import type { APIRoute } from 'astro';
import { applicationsRepo, enquiriesRepo, auditRepo } from '~lib/db';
import { readSession } from '~lib/auth/session';
import { isAdmin } from '~lib/auth/policies';
import {
  newApplicationId,
  newPaymentId,
  type Application,
  type ApplicationStatus,
  type Enquiry,
  type PaymentMethod,
  type ProgrammeId,
} from '~lib/schema';
import { formatINR } from '~lib/format';

export const prerender = false;

const SAMPLE: Array<{
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
const FEES: Record<ProgrammeId, number> = { 'MBA-BF': 1770, MMS: 1770, BMS: 1180, PHD: 2950 };
const METHODS: PaymentMethod[] = ['upi', 'card', 'netbanking', 'wallet'];

export const POST: APIRoute = async ({ cookies, request, clientAddress }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  await applicationsRepo.clear();
  await enquiriesRepo.clear();

  for (let i = 0; i < SAMPLE.length; i++) {
    const s = SAMPLE[i];
    const fee = FEES[s.programme];
    const method = METHODS[i % METHODS.length];
    const submittedAt = new Date(Date.now() - i * 86400000).toISOString();
    const app: Application = {
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
    await applicationsRepo.insert(app);
  }

  const enqs: Enquiry[] = [
    { id: 'ENQ-DEMO-1', received: new Date().toISOString(), name: 'Aditi Kale', email: 'aditi.k@gmail.com', programme: 'MBA · Banking & Finance', message: 'Looking for early decision details and scholarship opportunities.', phone: '' },
    { id: 'ENQ-DEMO-2', received: new Date(Date.now() - 86400000).toISOString(), name: 'Arnav Singh', email: 'arnav.s@outlook.com', programme: 'BMS', message: 'Class XII candidate. Could you share the prospectus?', phone: '' },
    { id: 'ENQ-DEMO-3', received: new Date(Date.now() - 86400000 * 2).toISOString(), name: 'Neha Pillai', email: 'n.pillai@gmail.com', programme: 'MMS', message: 'Working professional, two years experience. Eligibility query.', phone: '' },
    { id: 'ENQ-DEMO-4', received: new Date(Date.now() - 86400000 * 3).toISOString(), name: 'Rishi Kapur', email: 'rishi.k@gmail.com', programme: 'Ph.D.', message: 'Research interest in behavioural finance.', phone: '' },
  ];
  for (const e of enqs) await enquiriesRepo.insert(e);

  await auditRepo.record({
    actorId: session!.userId,
    actorEmail: session!.email,
    action: 'demo.seed',
    ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get('user-agent') ?? null,
    metadata: { applications: SAMPLE.length, enquiries: enqs.length },
  });

  return new Response(JSON.stringify({ ok: true, applications: SAMPLE.length, enquiries: enqs.length }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
