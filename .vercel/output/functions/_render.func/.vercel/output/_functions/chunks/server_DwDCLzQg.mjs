import argon2 from 'argon2';
import '@libsql/client';
import { g as getDb, u as users, L as LoginSchema } from './schema_DjDz_9BF.mjs';
import { isNull, eq, and } from 'drizzle-orm';
import { a as auditRepo } from './audit_CPWJxVu1.mjs';
import { r as readSession, s as setSessionCookie, c as clearSessionCookie } from './session_Dk9yDJEf.mjs';

const usersRepo = {
  async findByEmail(email) {
    const db = getDb();
    const rows = await db.select().from(users).where(and(eq(users.email, email.toLowerCase()), isNull(users.deletedAt))).limit(1);
    return rows[0] ?? null;
  },
  async findById(id) {
    const db = getDb();
    const rows = await db.select().from(users).where(and(eq(users.id, id), isNull(users.deletedAt))).limit(1);
    return rows[0] ?? null;
  },
  async create(input) {
    const db = getDb();
    const [row] = await db.insert(users).values({ ...input, email: input.email.toLowerCase() }).returning();
    return row;
  },
  async upsertByEmail(input) {
    const existing = await this.findByEmail(input.email);
    if (existing) return existing;
    return this.create(input);
  },
  async touchLogin(id) {
    const db = getDb();
    await db.update(users).set({ lastLoginAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id));
  },
  async list() {
    const db = getDb();
    return db.select().from(users).where(isNull(users.deletedAt));
  }
};

({
  type: argon2.argon2id});
async function verifyPassword(hash, plain) {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}
async function signIn(raw, ctx) {
  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    await auditRepo.record({
      actorId: null,
      actorEmail: typeof raw?.email === "string" ? raw.email : null,
      action: "auth.login.invalid_input",
      ip: ctx.ip ?? null,
      userAgent: ctx.userAgent ?? null
    });
    return { ok: false, reason: "invalid_input" };
  }
  const { email, password } = parsed.data;
  const user = await usersRepo.findByEmail(email);
  const placeholder = "$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const ok = user ? await verifyPassword(user.passwordHash, password) : (await verifyPassword(placeholder, password), false);
  if (!user || !ok) {
    await auditRepo.record({
      actorId: user?.id ?? null,
      actorEmail: email,
      action: "auth.login.failed",
      ip: ctx.ip ?? null,
      userAgent: ctx.userAgent ?? null
    });
    return { ok: false, reason: "invalid_credentials" };
  }
  await usersRepo.touchLogin(user.id);
  await setSessionCookie(ctx.cookies, {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now()
  });
  await auditRepo.record({
    actorId: user.id,
    actorEmail: user.email,
    action: "auth.login.success",
    ip: ctx.ip ?? null,
    userAgent: ctx.userAgent ?? null
  });
  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  };
}
async function signOut(ctx) {
  const session = await readSession(ctx.cookies);
  clearSessionCookie(ctx.cookies);
  await auditRepo.record({
    actorId: session?.userId ?? null,
    actorEmail: session?.email ?? null,
    action: "auth.logout",
    ip: ctx.ip ?? null,
    userAgent: ctx.userAgent ?? null
  });
}
async function currentUser(cookies) {
  const session = await readSession(cookies);
  if (!session) return null;
  return usersRepo.findById(session.userId);
}

export { signOut as a, currentUser as c, signIn as s };
