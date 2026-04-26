/**
 * pnpm db:seed
 *
 * Creates the initial Director user from ADMIN_EMAIL + ADMIN_PASSWORD env
 * vars (or sensible dev defaults). Idempotent — re-running is a no-op once
 * the user exists.
 */

import { usersRepo } from '../src/lib/db';
import { hashPassword } from '../src/lib/auth/server';

const email = (process.env.ADMIN_EMAIL ?? 'director@mmbgims.com').toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? 'bgims2026';
const name = process.env.ADMIN_NAME ?? 'Director';
const role = (process.env.ADMIN_ROLE as 'Director' | 'Staff') ?? 'Director';

async function main() {
  const existing = await usersRepo.findByEmail(email);
  if (existing) {
    console.log(`✓ user already exists: ${email} (id=${existing.id}, role=${existing.role})`);
    return;
  }
  const passwordHash = await hashPassword(password);
  const user = await usersRepo.create({ email, name, role, passwordHash });
  console.log(`✓ seeded ${role} user: ${user.email} (id=${user.id})`);
  if (password === 'bgims2026') {
    console.log('  ⚠  using default password — set ADMIN_PASSWORD before deploying.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
