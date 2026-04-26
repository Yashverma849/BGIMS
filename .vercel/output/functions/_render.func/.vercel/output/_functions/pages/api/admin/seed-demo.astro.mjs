import '@libsql/client';
import { n as newPaymentId, f as newApplicationId } from '../../../chunks/schema_DjDz_9BF.mjs';
import { a as applicationsRepo } from '../../../chunks/applications_C-hXM6jX.mjs';
import { e as enquiriesRepo } from '../../../chunks/enquiries_DHTE6f5E.mjs';
import { a as auditRepo } from '../../../chunks/audit_CPWJxVu1.mjs';
import { r as readSession } from '../../../chunks/session_Dk9yDJEf.mjs';
import { i as isAdmin } from '../../../chunks/policies_CgyPR65B.mjs';
import { a as formatINR } from '../../../chunks/format_BDq39xCP.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const SAMPLE = [
  { firstName: "Aanya", lastName: "Iyer", email: "aanya.iyer@gmail.com", programme: "MBA-BF", status: "shortlisted" },
  { firstName: "Karan", lastName: "Kothari", email: "karan.k@outlook.com", programme: "MBA-BF", status: "interviewed" },
  { firstName: "Riya", lastName: "Bhatt", email: "riya.b@yahoo.com", programme: "MMS", status: "submitted" },
  { firstName: "Aniket", lastName: "Patil", email: "aniket.p@gmail.com", programme: "BMS", status: "offered" },
  { firstName: "Tanvi", lastName: "Shah", email: "tanvi.shah@gmail.com", programme: "MMS", status: "shortlisted" },
  { firstName: "Kabir", lastName: "Joshi", email: "kabir.j@protonmail.com", programme: "MBA-BF", status: "submitted" },
  { firstName: "Sneha", lastName: "Gupta", email: "sneha.gupta@gmail.com", programme: "BMS", status: "submitted" },
  { firstName: "Vikram", lastName: "Mehra", email: "vikram.m@outlook.com", programme: "PHD", status: "interviewed" },
  { firstName: "Pooja", lastName: "Reddy", email: "pooja.r@gmail.com", programme: "MMS", status: "submitted" },
  { firstName: "Arjun", lastName: "Nair", email: "arjun.n@yahoo.com", programme: "MBA-BF", status: "rejected" },
  { firstName: "Meera", lastName: "Desai", email: "meera.d@gmail.com", programme: "MMS", status: "shortlisted" },
  { firstName: "Rohan", lastName: "Saxena", email: "rohan.s@gmail.com", programme: "BMS", status: "submitted" }
];
const FEES = { "MBA-BF": 1770, MMS: 1770, BMS: 1180, PHD: 2950 };
const METHODS = ["upi", "card", "netbanking", "wallet"];
const POST = async ({ cookies, request, clientAddress }) => {
  const session = await readSession(cookies);
  if (!isAdmin(session)) {
    return new Response(JSON.stringify({ error: "unauthenticated" }), {
      status: 401,
      headers: { "content-type": "application/json" }
    });
  }
  await applicationsRepo.clear();
  await enquiriesRepo.clear();
  for (let i = 0; i < SAMPLE.length; i++) {
    const s = SAMPLE[i];
    const fee = FEES[s.programme];
    const method = METHODS[i % METHODS.length];
    const submittedAt = new Date(Date.now() - i * 864e5).toISOString();
    const app = {
      id: newApplicationId(Date.now() - i * 864e5),
      submittedAt,
      personal: {
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        phone: "+91 9" + Math.floor(1e8 + Math.random() * 9e8),
        dob: "2002-01-01",
        gender: "Prefer not to say",
        address: "Mumbai",
        city: "Mumbai",
        state: "Maharashtra",
        pin: "400008"
      },
      academic: {
        x_board: "Maharashtra State Board",
        x_year: 2018,
        x_score: "88%",
        xii_board: "CBSE",
        xii_year: 2020,
        xii_score: "90%",
        ug_university: "University of Mumbai",
        ug_programme: "B.Com",
        ug_score: "8.5 CGPA",
        entrance_test: "CAT",
        entrance_year: 2025,
        entrance_score: "92%ile"
      },
      programme: s.programme,
      sop: "",
      ref_name: "",
      ref_email: "",
      payMethod: method,
      amount: formatINR(fee),
      status: s.status,
      payment: {
        id: newPaymentId(),
        method,
        amount: formatINR(fee),
        capturedAt: submittedAt
      }
    };
    await applicationsRepo.insert(app);
  }
  const enqs = [
    { id: "ENQ-DEMO-1", received: (/* @__PURE__ */ new Date()).toISOString(), name: "Aditi Kale", email: "aditi.k@gmail.com", programme: "MBA · Banking & Finance", message: "Looking for early decision details and scholarship opportunities.", phone: "" },
    { id: "ENQ-DEMO-2", received: new Date(Date.now() - 864e5).toISOString(), name: "Arnav Singh", email: "arnav.s@outlook.com", programme: "BMS", message: "Class XII candidate. Could you share the prospectus?", phone: "" },
    { id: "ENQ-DEMO-3", received: new Date(Date.now() - 864e5 * 2).toISOString(), name: "Neha Pillai", email: "n.pillai@gmail.com", programme: "MMS", message: "Working professional, two years experience. Eligibility query.", phone: "" },
    { id: "ENQ-DEMO-4", received: new Date(Date.now() - 864e5 * 3).toISOString(), name: "Rishi Kapur", email: "rishi.k@gmail.com", programme: "Ph.D.", message: "Research interest in behavioural finance.", phone: "" }
  ];
  for (const e of enqs) await enquiriesRepo.insert(e);
  await auditRepo.record({
    actorId: session.userId,
    actorEmail: session.email,
    action: "demo.seed",
    ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get("user-agent") ?? null,
    metadata: { applications: SAMPLE.length, enquiries: enqs.length }
  });
  return new Response(JSON.stringify({ ok: true, applications: SAMPLE.length, enquiries: enqs.length }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
