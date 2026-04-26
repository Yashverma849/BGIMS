import { desc } from 'drizzle-orm';
import { g as getDb, b as auditLog } from './schema_DjDz_9BF.mjs';

const auditRepo = {
  async record(input) {
    const db = getDb();
    await db.insert(auditLog).values({
      actorId: input.actorId,
      actorEmail: input.actorEmail,
      action: input.action,
      targetType: input.targetType ?? null,
      targetId: input.targetId ?? null,
      ip: input.ip ?? null,
      userAgent: input.userAgent ?? null,
      metadata: input.metadata ?? null
    });
  },
  async recent(limit = 50) {
    const db = getDb();
    return db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);
  }
};

export { auditRepo as a };
