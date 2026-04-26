import { and, eq, desc, sql } from 'drizzle-orm';
import { getDb } from '../client';
import { applications, type ApplicationRow } from '../schema';
import {
  ApplicationSchema,
  type Application,
  type ProgrammeId,
  type ApplicationStatus,
} from '~lib/schema';

function rowToApplication(row: ApplicationRow): Application {
  // Re-validate on read so any silent payload-shape drift is caught loudly.
  return ApplicationSchema.parse(row.payload);
}

function amountToPaise(amountLabel: string): number {
  const rupees = Number(amountLabel.replace(/[^\d.]/g, ''));
  return Math.round(rupees * 100);
}

export const applicationsRepo = {
  async insert(app: Application): Promise<Application> {
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
    const db = getDb();
    const rows = await db.select().from(applications).where(eq(applications.id, id)).limit(1);
    if (!rows.length) return null;
    return rowToApplication(rows[0]);
  },

  async setStatus(id: string, status: ApplicationStatus): Promise<void> {
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
    const db = getDb();
    await db.delete(applications);
  },

  async count(): Promise<number> {
    const db = getDb();
    const r = await db.select({ c: sql<number>`count(*)` }).from(applications);
    return Number(r[0].c);
  },
};
