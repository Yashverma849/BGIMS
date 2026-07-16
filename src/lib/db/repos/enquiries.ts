import { desc, eq, sql } from 'drizzle-orm';
import { getDb } from '../client';
import { enquiries, type EnquiryRow } from '../schema';
import { EnquirySchema, type Enquiry } from '~lib/schema';
import { isSupabase, supabaseFetch } from '../supabase';

function rowToEnquiry(row: any): Enquiry {
  return EnquirySchema.parse({
    id: row.id,
    received: typeof row.receivedAt === 'object' && row.receivedAt
      ? row.receivedAt.toISOString()
      : new Date(row.receivedAt || row.received_at).toISOString(),
    name: row.name,
    email: row.email,
    phone: row.phone,
    programme: row.programme,
    message: row.message,
    consent: row.consent === true || row.consent === 1,
  });
}

export const enquiriesRepo = {
  async insert(enq: Enquiry): Promise<Enquiry> {
    if (isSupabase) {
      await supabaseFetch('/enquiries', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=ignore-duplicates' },
        body: JSON.stringify({
          id: enq.id,
          name: enq.name,
          email: enq.email,
          phone: enq.phone,
          programme: enq.programme,
          message: enq.message,
          consent: enq.consent ?? false,
          status: 'new',
          received_at: new Date(enq.received).toISOString(),
        }),
      });
      return enq;
    }

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
    if (isSupabase) {
      const res = await supabaseFetch(`/enquiries?select=*&order=received_at.desc&limit=${limit}`);
      const rows = await res.json();
      return rows.map(rowToEnquiry);
    }

    const db = getDb();
    const rows = await db
      .select()
      .from(enquiries)
      .orderBy(desc(enquiries.receivedAt))
      .limit(limit);
    return rows.map(rowToEnquiry);
  },

  async setStatus(id: string, status: 'new' | 'contacted' | 'closed'): Promise<void> {
    if (isSupabase) {
      await supabaseFetch(`/enquiries?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return;
    }

    const db = getDb();
    await db.update(enquiries).set({ status }).where(eq(enquiries.id, id));
  },

  async clear(): Promise<void> {
    if (isSupabase) {
      await supabaseFetch('/enquiries', {
        method: 'DELETE',
      });
      return;
    }

    const db = getDb();
    await db.delete(enquiries);
  },

  async count(): Promise<number> {
    if (isSupabase) {
      const res = await supabaseFetch('/enquiries?select=id', {
        headers: { 'Prefer': 'count=exact', 'Range': '0-0' },
      });
      const range = res.headers.get('content-range') || '';
      const parts = range.split('/');
      return parts[1] ? parseInt(parts[1], 10) : 0;
    }

    const db = getDb();
    const r = await db.select({ c: sql<number>`count(*)` }).from(enquiries);
    return Number(r[0].c);
  },
};
