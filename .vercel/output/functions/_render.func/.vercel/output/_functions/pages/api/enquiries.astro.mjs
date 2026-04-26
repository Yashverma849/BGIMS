import { h as newEnquiryId, E as EnquirySchema } from '../../chunks/schema_DjDz_9BF.mjs';
import '@libsql/client';
import { e as enquiriesRepo } from '../../chunks/enquiries_DHTE6f5E.mjs';
import { a as auditRepo } from '../../chunks/audit_CPWJxVu1.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
async function maybeSendConfirmationEmail(enq) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[enquiries] received ${enq.id} from ${enq.email} (no email — RESEND_API_KEY unset)`);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: "MM BGIMS <admissions@mmbgims.com>",
        to: enq.email,
        subject: `We received your enquiry · ${enq.id}`,
        text: `Dear ${enq.name},

Thank you for writing to MM BGIMS. The right desk has received your message and we will respond within one working day.

Reference: ${enq.id}

— Admissions Office`
      })
    });
  } catch (err) {
    console.error("[enquiries] resend failed", err);
  }
}
const POST = async ({ request, clientAddress }) => {
  const json = await request.json().catch(() => null);
  if (!json) {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 });
  }
  const draft = {
    id: typeof json.id === "string" ? json.id : newEnquiryId(),
    received: typeof json.received === "string" ? json.received : (/* @__PURE__ */ new Date()).toISOString(),
    name: json.name,
    email: json.email,
    phone: json.phone ?? "",
    programme: json.programme ?? "General enquiry",
    message: json.message,
    consent: json.consent === true
  };
  const parsed = EnquirySchema.safeParse(draft);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "validation_failed", issues: parsed.error.issues }),
      { status: 422, headers: { "content-type": "application/json" } }
    );
  }
  await enquiriesRepo.insert(parsed.data);
  await auditRepo.record({
    actorId: null,
    actorEmail: parsed.data.email,
    action: "enquiry.received",
    targetType: "enquiry",
    targetId: parsed.data.id,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? clientAddress ?? null,
    userAgent: request.headers.get("user-agent") ?? null
  });
  void maybeSendConfirmationEmail(parsed.data);
  return new Response(JSON.stringify(parsed.data), {
    status: 201,
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
