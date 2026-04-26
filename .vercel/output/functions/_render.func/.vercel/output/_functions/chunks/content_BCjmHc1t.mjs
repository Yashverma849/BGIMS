import { eq } from 'drizzle-orm';
import { g as getDb, c as contentDrafts, C as ContentDraftSchema } from './schema_DjDz_9BF.mjs';

const contentRepo = {
  async get(key) {
    const db = getDb();
    const rows = await db.select().from(contentDrafts).where(eq(contentDrafts.key, key)).limit(1);
    if (!rows.length) return null;
    return ContentDraftSchema.parse(rows[0].payload);
  },
  async upsert(key, payload, updatedBy) {
    const db = getDb();
    await db.insert(contentDrafts).values({ key, payload, updatedBy: updatedBy ?? null, updatedAt: /* @__PURE__ */ new Date() }).onConflictDoUpdate({
      target: contentDrafts.key,
      set: { payload, updatedBy: updatedBy ?? null, updatedAt: /* @__PURE__ */ new Date() }
    });
  }
};

export { contentRepo as c };
