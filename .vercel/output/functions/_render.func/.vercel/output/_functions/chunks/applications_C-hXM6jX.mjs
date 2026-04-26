import { sql, eq, and, desc } from 'drizzle-orm';
import { g as getDb, a as applications, A as ApplicationSchema } from './schema_DjDz_9BF.mjs';

function rowToApplication(row) {
  return ApplicationSchema.parse(row.payload);
}
function amountToPaise(amountLabel) {
  const rupees = Number(amountLabel.replace(/[^\d.]/g, ""));
  return Math.round(rupees * 100);
}
const applicationsRepo = {
  async insert(app) {
    const db = getDb();
    await db.insert(applications).values({
      id: app.id,
      programme: app.programme,
      status: app.status,
      firstName: app.personal.firstName,
      lastName: app.personal.lastName,
      email: app.personal.email,
      phone: app.personal.phone,
      amountInPaise: amountToPaise(app.amount),
      payMethod: app.payMethod,
      paymentId: app.payment.id,
      payload: app,
      submittedAt: new Date(app.submittedAt)
    }).onConflictDoNothing();
    return app;
  },
  async list(opts) {
    const db = getDb();
    const filters = [];
    if (opts?.programme) filters.push(eq(applications.programme, opts.programme));
    if (opts?.status) filters.push(eq(applications.status, opts.status));
    const rows = await db.select().from(applications).where(filters.length ? and(...filters) : void 0).orderBy(desc(applications.submittedAt)).limit(opts?.limit ?? 1e3);
    return rows.map(rowToApplication);
  },
  async byId(id) {
    const db = getDb();
    const rows = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
    if (!rows.length) return null;
    return rowToApplication(rows[0]);
  },
  async setStatus(id, status) {
    const db = getDb();
    const row = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
    if (!row.length) return;
    const updated = { ...rowToApplication(row[0]), status };
    await db.update(applications).set({ status, payload: updated, updatedAt: /* @__PURE__ */ new Date() }).where(eq(applications.id, id));
  },
  async stats() {
    const db = getDb();
    const all = await db.select().from(applications);
    const todayStart = /* @__PURE__ */ new Date();
    todayStart.setHours(0, 0, 0, 0);
    const byProgramme = {
      "MBA-BF": 0,
      MMS: 0,
      BMS: 0,
      PHD: 0
    };
    let revenuePaise = 0;
    let todayPaise = 0;
    for (const r of all) {
      byProgramme[r.programme] += 1;
      revenuePaise += r.amountInPaise;
      if (r.submittedAt.getTime() >= todayStart.getTime()) todayPaise += r.amountInPaise;
    }
    return { total: all.length, revenuePaise, byProgramme, todayPaise };
  },
  async clear() {
    const db = getDb();
    await db.delete(applications);
  },
  async count() {
    const db = getDb();
    const r = await db.select({ c: sql`count(*)` }).from(applications);
    return Number(r[0].c);
  }
};

export { applicationsRepo as a };
