import { desc, eq, sql } from 'drizzle-orm';
import { getDb } from '../client';
import { enquiries, type EnquiryRow } from '../schema';
import { EnquirySchema, type Enquiry } from '~lib/schema';

function rowToEnquiry(row: EnquiryRow): Enquiry {
  return EnquirySchema.parse({
    id: row.id,
    received: row.receivedAt.toISOString(),
    name: row.name,
    email: row.email,
    phone: row.phone,
    programme: row.programme,
    message: row.message,
    consent: row.consent,
  });
}

export const enquiriesRepo = {
  async insert(enq: Enquiry): Promise<Enquiry> {
    const db = getDb();
    await db
      .insert(enquiries)
      .values({
        id: enq.id,
        name: enq.name,
        email: enq.email,
        phone: enq.phone,
        programme: enq.programme,
        message: enq.message,
        consent: enq.consent ?? false,
        receivedAt: new Date(enq.received),
      })
      .onConflictDoNothing();
    return enq;
  },

  async list(limit = 1000): Promise<Enquiry[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(enquiries)
      .orderBy(desc(enquiries.receivedAt))
      .limit(limit);
    return rows.map(rowToEnquiry);
  },

  async setStatus(id: string, status: 'new' | 'contacted' | 'closed'): Promise<void> {
    const db = getDb();
    await db.update(enquiries).set({ status }).where(eq(enquiries.id, id));
  },

  async clear(): Promise<void> {
    const db = getDb();
    await db.delete(enquiries);
  },

  async count(): Promise<number> {
    const db = getDb();
    const r = await db.select({ c: sql<number>`count(*)` }).from(enquiries);
    return Number(r[0].c);
  },
};
