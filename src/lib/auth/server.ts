/**
 * Server-side auth module.
 *
 * Responsibilities:
 *   - hash + verify passwords (Argon2id, OWASP-recommended params)
 *   - bridge a successful credential check into a session cookie
 *   - record audit-log entries for each login attempt
 *
 * Used exclusively from /api/auth/* and middleware. No client code reaches
 * for this — clients call the JSON endpoints.
 */

import argon2 from 'argon2';
import type { AstroCookies } from 'astro';
import { usersRepo, auditRepo, type User } from '~lib/db';
import { LoginSchema, type LoginInput } from '~lib/schema';
import { setSessionCookie, clearSessionCookie, readSession } from './session';

const ARGON_OPTS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 19_456, // 19 MiB — OWASP minimum
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, ARGON_OPTS);
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}

export interface SignInResult {
  ok: boolean;
  user?: { id: number; email: string; name: string; role: 'Director' | 'Staff' };
  reason?: 'invalid_input' | 'invalid_credentials';
}

export async function signIn(
  raw: unknown,
  ctx: { cookies: AstroCookies; ip?: string; userAgent?: string },
): Promise<SignInResult> {
  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    await auditRepo.record({
      actorId: null,
      actorEmail: typeof (raw as { email?: string })?.email === 'string'
        ? (raw as { email: string }).email
        : null,
      action: 'auth.login.invalid_input',
      ip: ctx.ip ?? null,
      userAgent: ctx.userAgent ?? null,
    });
    return { ok: false, reason: 'invalid_input' };
  }

  const { email, password } = parsed.data as LoginInput;
  const user = await usersRepo.findByEmail(email);
  // Always verify against a placeholder hash on miss to avoid timing oracles.
  const placeholder = '$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  const ok = user
    ? await verifyPassword(user.passwordHash, password)
    : (await verifyPassword(placeholder, password), false);

  if (!user || !ok) {
    await auditRepo.record({
      actorId: user?.id ?? null,
      actorEmail: email,
      action: 'auth.login.failed',
      ip: ctx.ip ?? null,
      userAgent: ctx.userAgent ?? null,
    });
    return { ok: false, reason: 'invalid_credentials' };
  }

  await usersRepo.touchLogin(user.id);
  await setSessionCookie(ctx.cookies, {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
  });
  await auditRepo.record({
    actorId: user.id,
    actorEmail: user.email,
    action: 'auth.login.success',
    ip: ctx.ip ?? null,
    userAgent: ctx.userAgent ?? null,
  });

  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export async function signOut(
  ctx: { cookies: AstroCookies; ip?: string; userAgent?: string },
): Promise<void> {
  const session = await readSession(ctx.cookies);
  clearSessionCookie(ctx.cookies);
  await auditRepo.record({
    actorId: session?.userId ?? null,
    actorEmail: session?.email ?? null,
    action: 'auth.logout',
    ip: ctx.ip ?? null,
    userAgent: ctx.userAgent ?? null,
  });
}

export async function currentUser(cookies: AstroCookies): Promise<User | null> {
  const session = await readSession(cookies);
  if (!session) return null;
  return usersRepo.findById(session.userId);
}

export function requireRole(user: { role: string } | null, role: 'Director' | 'Staff'): boolean {
  if (!user) return false;
  if (role === 'Staff') return user.role === 'Staff' || user.role === 'Director';
  return user.role === role;
}
