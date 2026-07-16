import { and, eq, desc, sql } from 'drizzle-orm';
import { getDb } from '../client';
import { applications, type ApplicationRow } from '../schema';
import {
  ApplicationSchema,
  type Application,
  type ProgrammeId,
  type ApplicationStatus,
} from '~lib/schema';
import { isSupabase, supabaseFetch } from '../supabase';

function rowToApplication(row: any): Application {
  const acad = Array.isArray(row.academic) ? row.academic[0] : row.academic;
  const prog = Array.isArray(row.programme) ? row.programme[0] : row.programme;
  const pay = Array.isArray(row.payments) ? row.payments[0] : row.payments;

  if (!acad || !prog) {
    throw new Error(`Data corruption: personal record ${row.id} has no academic/programme details.`);
  }

  return ApplicationSchema.parse({
    id: row.id,
    submittedAt: new Date(prog.submitted_at).toISOString(),
    personal: {
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      dob: row.dob,
      gender: row.gender,
      address: row.address,
      city: row.city,
      state: row.state,
      pin: row.pin,
    },
    academic: {
      x_board: acad.x_board,
      x_year: Number(acad.x_year),
      x_score: acad.x_score,
      xii_board: acad.xii_board,
      xii_year: Number(acad.xii_year),
      xii_score: acad.xii_score,
      ug_university: acad.ug_university || '',
      ug_programme: acad.ug_programme || '',
      ug_score: acad.ug_score || '',
      entrance_test: acad.entrance_test || '',
      entrance_year: acad.entrance_year ? Number(acad.entrance_year) : undefined,
      entrance_score: acad.entrance_score || '',
    },
    programme: prog.programme_id,
    sop: prog.sop || '',
    ref_name: prog.ref_name || '',
    ref_email: prog.ref_email || '',
    payMethod: pay ? pay.method : 'upi',
    amount: pay ? pay.amount : 'Rs. 0',
    status: prog.status,
    payment: {
      id: pay ? pay.id : 'pending',
      method: pay ? pay.method : 'upi',
      amount: pay ? pay.amount : 'Rs. 0',
      capturedAt: pay ? new Date(pay.captured_at).toISOString() : new Date().toISOString(),
    },
  });
}

function amountToPaise(amountLabel: string): number {
  const rupees = Number(amountLabel.replace(/[^\d.]/g, ''));
  return Math.round(rupees * 100);
}

export const applicationsRepo = {
  async insert(app: Application & { documents?: Record<string, string> }): Promise<Application> {
    if (isSupabase) {
      // 1. Insert into personal table
      await supabaseFetch('/personal', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=ignore-duplicates' },
        body: JSON.stringify({
          id: app.id,
          first_name: app.personal.firstName,
          last_name: app.personal.lastName,
          email: app.personal.email,
          phone: app.personal.phone,
          dob: app.personal.dob,
          gender: app.personal.gender,
          address: app.personal.address,
          city: app.personal.city,
          state: app.personal.state,
          pin: app.personal.pin,
        }),
      });

      // 2. Insert into academic table
      await supabaseFetch('/academic', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=ignore-duplicates' },
        body: JSON.stringify({
          application_id: app.id,
          x_board: app.academic.x_board,
          x_year: Number(app.academic.x_year),
          x_score: app.academic.x_score,
          xii_board: app.academic.xii_board,
          xii_year: Number(app.academic.xii_year),
          xii_score: app.academic.xii_score,
          ug_university: app.academic.ug_university || null,
          ug_programme: app.academic.ug_programme || null,
          ug_score: app.academic.ug_score || null,
          entrance_test: app.academic.entrance_test || null,
          entrance_year: app.academic.entrance_year ? Number(app.academic.entrance_year) : null,
          entrance_score: app.academic.entrance_score || null,
        }),
      });

      // 3. Insert into programme table
      await supabaseFetch('/programme', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=ignore-duplicates' },
        body: JSON.stringify({
          application_id: app.id,
          programme_id: app.programme,
          sop: app.sop || null,
          ref_name: app.ref_name || null,
          ref_email: app.ref_email || null,
          status: app.status,
          submitted_at: new Date(app.submittedAt).toISOString(),
        }),
      });

      // 4. Insert into payments table
      if (app.payment && app.payment.id !== 'pending') {
        await supabaseFetch('/payments', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=ignore-duplicates' },
          body: JSON.stringify({
            id: app.payment.id,
            application_id: app.id,
            amount: app.payment.amount,
            method: app.payment.method,
            captured_at: new Date(app.payment.capturedAt).toISOString(),
          }),
        });
      }

      // 5. Insert into document table (multiple files if uploaded)
      if (app.documents) {
        for (const [docType, filePath] of Object.entries(app.documents)) {
          if (filePath) {
            await supabaseFetch('/document', {
              method: 'POST',
              headers: { 'Prefer': 'resolution=ignore-duplicates' },
              body: JSON.stringify({
                application_id: app.id,
                document_type: docType,
                file_path: filePath,
              }),
            });
          }
        }
      }

      return app;
    }

    const db = getDb();
    await db
      .insert(applications)
      .values({
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
        submittedAt: new Date(app.submittedAt),
      })
      .onConflictDoNothing();
    return app;
  },

  async list(opts?: {
    programme?: ProgrammeId;
    status?: ApplicationStatus;
    limit?: number;
  }): Promise<Application[]> {
    if (isSupabase) {
      let query = '/personal?select=*,academic(*),programme(*),payments(*)';
      if (opts?.programme) {
        query += `&programme.programme_id=eq.${opts.programme}`;
      }
      if (opts?.status) {
        query += `&programme.status=eq.${opts.status}`;
      }
      query += `&limit=${opts?.limit ?? 1000}`;

      const res = await supabaseFetch(query);
      const rows = await res.json();

      const matched = rows.filter((r: any) => {
        const prog = Array.isArray(r.programme) ? r.programme[0] : r.programme;
        if (!prog) return false;
        if (opts?.programme && prog.programme_id !== opts.programme) return false;
        if (opts?.status && prog.status !== opts.status) return false;
        return true;
      });

      return matched.map(rowToApplication);
    }

    const db = getDb();
    const filters = [];
    if (opts?.programme) filters.push(eq(applications.programme, opts.programme));
    if (opts?.status) filters.push(eq(applications.status, opts.status));
    const rows = await db
      .select()
      .from(applications)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(applications.submittedAt))
      .limit(opts?.limit ?? 1000);
    return rows.map(rowToApplication);
  },

  async byId(id: string): Promise<Application | null> {
    if (isSupabase) {
      const res = await supabaseFetch(`/personal?id=eq.${id}&select=*,academic(*),programme(*),payments(*)&limit=1`);
      const rows = await res.json();
      if (!rows.length) return null;
      return rowToApplication(rows[0]);
    }

    const db = getDb();
    const rows = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
    if (!rows.length) return null;
    return rowToApplication(rows[0]);
  },

  async setStatus(id: string, status: ApplicationStatus): Promise<void> {
    if (isSupabase) {
      await supabaseFetch(`/programme?application_id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          updated_at: new Date().toISOString(),
        }),
      });
      return;
    }

    const db = getDb();
    const row = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
    if (!row.length) return;
    const updated: Application = { ...rowToApplication(row[0]), status };
    await db
      .update(applications)
      .set({ status, payload: updated, updatedAt: new Date() })
      .where(eq(applications.id, id));
  },

  async stats(): Promise<{
    total: number;
    revenuePaise: number;
    byProgramme: Record<ProgrammeId, number>;
    todayPaise: number;
  }> {
    if (isSupabase) {
      const res = await supabaseFetch('/personal?select=*,academic(*),programme(*),payments(*)');
      const all = await res.json();
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const byProgramme: Record<ProgrammeId, number> = {
        'MBA-BF': 0,
        MMS: 0,
        BMS: 0,
        PHD: 0,
      };
      let revenuePaise = 0;
      let todayPaise = 0;
      for (const r of all) {
        const prog = Array.isArray(r.programme) ? r.programme[0] : r.programme;
        const pay = Array.isArray(r.payments) ? r.payments[0] : r.payments;
        if (prog) {
          byProgramme[prog.programme_id as ProgrammeId] += 1;
        }
        if (pay) {
          const rupees = Number(pay.amount.replace(/[^\d.]/g, ''));
          const paise = Math.round(rupees * 100);
          revenuePaise += paise;
          const capturedDate = new Date(pay.captured_at);
          if (capturedDate.getTime() >= todayStart.getTime()) {
            todayPaise += paise;
          }
        }
      }
      return { total: all.length, revenuePaise, byProgramme, todayPaise };
    }

    const db = getDb();
    const all = await db.select().from(applications);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const byProgramme: Record<ProgrammeId, number> = {
      'MBA-BF': 0,
      MMS: 0,
      BMS: 0,
      PHD: 0,
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

  async clear(): Promise<void> {
    if (isSupabase) {
      await supabaseFetch('/personal', {
        method: 'DELETE',
      });
      return;
    }

    const db = getDb();
    await db.delete(applications);
  },

  async count(): Promise<number> {
    if (isSupabase) {
      const res = await supabaseFetch('/personal?select=id', {
        headers: { 'Prefer': 'count=exact', 'Range': '0-0' },
      });
      const range = res.headers.get('content-range') || '';
      const parts = range.split('/');
      return parts[1] ? parseInt(parts[1], 10) : 0;
    }

    const db = getDb();
    const r = await db.select({ c: sql<number>`count(*)` }).from(applications);
    return Number(r[0].c);
  },
};
