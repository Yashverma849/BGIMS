import { eq, and, isNull } from 'drizzle-orm';
import { getDb } from '../client';
import { users, type User, type NewUser } from '../schema';

export const usersRepo = {
  async findByEmail(email: string): Promise<User | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email.toLowerCase()), isNull(users.deletedAt)))
      .limit(1);
    return rows[0] ?? null;
  },

  async findById(id: number): Promise<User | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1);
    return rows[0] ?? null;
  },

  async create(input: Omit<NewUser, 'id' | 'createdAt'>): Promise<User> {
    const db = getDb();
    const [row] = await db
      .insert(users)
      .values({ ...input, email: input.email.toLowerCase() })
      .returning();
    return row;
  },

  async upsertByEmail(input: Omit<NewUser, 'id' | 'createdAt'>): Promise<User> {
    const existing = await this.findByEmail(input.email);
    if (existing) return existing;
    return this.create(input);
  },

  async touchLogin(id: number): Promise<void> {
    const db = getDb();
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, id));
  },

  async list(): Promise<User[]> {
    const db = getDb();
    return db.select().from(users).where(isNull(users.deletedAt));
  },
};
