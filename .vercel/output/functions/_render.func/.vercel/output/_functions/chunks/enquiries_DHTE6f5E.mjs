import { sql, eq, desc } from 'drizzle-orm';
import { g as getDb, e as enquiries, E as EnquirySchema } from './schema_DjDz_9BF.mjs';

function rowToEnquiry(row) {
  return EnquirySchema.parse({
    id: row.id,
    received: row.receivedAt.toISOString(),
    name: row.name,
    email: row.email,
    phone: row.phone,
    programme: row.programme,
    message: row.message,
    consent: row.consent
  });
}
const enquiriesRepo = {
  async insert(enq) {
    const db = getDb();
    await db.insert(enquiries).values({
      id: enq.id,
      name: enq.name,
      email: enq.email,
      phone: enq.phone,
      programme: enq.programme,
      message: enq.message,
      consent: enq.consent ?? false,
      receivedAt: new Date(enq.received)
    }).onConflictDoNothing();
    return enq;
  },
  async list(limit = 1e3) {
    const db = getDb();
    const rows = await db.select().from(enquiries).orderBy(desc(enquiries.receivedAt)).limit(limit);
    return rows.map(rowToEnquiry);
  },
  async setStatus(id, status) {
    const db = getDb();
    await db.update(enquiries).set({ status }).where(eq(enquiries.id, id));
  },
  async clear() {
    const db = getDb();
    await db.delete(enquiries);
  },
  async count() {
    const db = getDb();
    const r = await db.select({ c: sql`count(*)` }).from(enquiries);
    return Number(r[0].c);
  }
};

export { enquiriesRepo as e };
