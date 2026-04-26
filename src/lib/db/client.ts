/**
 * Singleton database client.
 *
 * Lives module-scoped so the same connection is reused across requests in
 * the long-lived Node server. The file lives at DATABASE_URL (or .data/
 * by default) and is created on first access.
 *
 * For Postgres, swap better-sqlite3 → pg + drizzle-orm/node-postgres. The
 * schema and the rest of the codebase stay identical.
 */

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate as runMigrations } from 'drizzle-orm/better-sqlite3/migrator';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from './schema';

const DEFAULT_DB_FILE = './.data/mmbgims.db';

function dbPath(): string {
  return resolve(process.cwd(), process.env.DATABASE_URL ?? DEFAULT_DB_FILE);
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _sqlite: Database.Database | null = null;

export function getDb() {
  if (_db) return _db;
  const file = dbPath();
  mkdirSync(dirname(file), { recursive: true });
  _sqlite = new Database(file);
  _sqlite.pragma('journal_mode = WAL');
  _sqlite.pragma('foreign_keys = ON');
  _sqlite.pragma('busy_timeout = 5000');
  _db = drizzle(_sqlite, { schema });

  // Auto-migrate on first connection so deployments don't need a separate
  // migration step. drizzle-kit's __drizzle_migrations table makes this
  // idempotent.
  const migrationsFolder = resolve(
    fileURLToPath(new URL('./migrations', import.meta.url)),
  );
  if (existsSync(migrationsFolder)) {
    runMigrations(_db, { migrationsFolder });
  }

  return _db;
}

export function closeDb(): void {
  _sqlite?.close();
  _db = null;
  _sqlite = null;
}

export { schema };
export type Db = ReturnType<typeof getDb>;
