/**
 * pnpm db:migrate
 *
 * Applies pending Drizzle migrations against the configured database.
 * Safe to run repeatedly — idempotent via __drizzle_migrations table.
 */

import { getDb } from '../src/lib/db';

async function main() {
  // Touching the client triggers auto-migrate inside getDb().
  getDb();
  console.log('✓ migrations applied');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
