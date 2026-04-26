import { eq } from 'drizzle-orm';
import { getDb } from '../client';
import { contentDrafts } from '../schema';
import { ContentDraftSchema, type ContentDraft } from '~lib/schema';

export const contentRepo = {
  async get(key: string): Promise<ContentDraft | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(contentDrafts)
      .where(eq(contentDrafts.key, key))
      .limit(1);
    if (!rows.length) return null;
    return ContentDraftSchema.parse(rows[0].payload);
  },

  async upsert(key: string, payload: ContentDraft, updatedBy: number | null): Promise<void> {
    const db = getDb();
    await db
      .insert(contentDrafts)
      .values({ key, payload, updatedBy: updatedBy ?? null, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: contentDrafts.key,
        set: { payload, updatedBy: updatedBy ?? null, updatedAt: new Date() },
      });
  },
};
