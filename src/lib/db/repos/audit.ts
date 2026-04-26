import { desc } from 'drizzle-orm';
import { getDb } from '../client';
import { auditLog, type AuditEntry } from '../schema';

export interface AuditInput {
  actorId: number | null;
  actorEmail: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

export const auditRepo = {
  async record(input: AuditInput): Promise<void> {
    const db = getDb();
    await db.insert(auditLog).values({
      actorId: input.actorId,
      actorEmail: input.actorEmail,
      action: input.action,
      targetType: input.targetType ?? null,
      targetId: input.targetId ?? null,
      ip: input.ip ?? null,
      userAgent: input.userAgent ?? null,
      metadata: input.metadata ?? null,
    });
  },

  async recent(limit = 50): Promise<AuditEntry[]> {
    const db = getDb();
    return db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);
  },
};
