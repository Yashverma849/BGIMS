/**
 * Database client — libSQL.
 *
 * One driver, two homes:
 *   - Local / self-hosted Node:  DATABASE_URL=file:./.data/mmbgims.db
 *   - Vercel / Netlify / Cloudflare:
 *       DATABASE_URL=libsql://<your-db>.turso.io
 *       DATABASE_AUTH_TOKEN=<turso token>
 *
 * `@libsql/client` speaks both, so we can run on a serverless edge without
 * rewriting any repository code. Drizzle's libsql adapter exposes the same
 * query builder we use everywhere else.
 *
 * Migrations are applied lazily on the first request when running file://
 * (so `pnpm start` "just works" out of the box). For Turso, run
 * `pnpm db:migrate` from CI / a one-off shell after deploying the schema —
 * remote DBs require a connection per migration step which is undesirable
 * in a hot serverless function.
 */

import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate as runMigrations } from 'drizzle-orm/libsql/migrator';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from './schema';

const DEFAULT_LOCAL_FILE = './.data/mmbgims.db';

function resolveUrl(): string {
  const raw = process.env.DATABASE_URL ?? `file:${DEFAULT_LOCAL_FILE}`;
  if (raw.startsWith('file:')) {
    const path = raw.slice('file:'.length);
    const absolute = resolve(process.cwd(), path);
    mkdirSync(dirname(absolute), { recursive: true });
    return `file:${absolute}`;
  }
  return raw;
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _client: Client | null = null;
let _migrationsApplied = false;

export function getDb() {
  if (_db) return _db;
  const url = resolveUrl();
  _client = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  _db = drizzle(_client, { schema });

  // Lazy auto-migrate on file:// only — for hosted Turso, run migrations
  // explicitly via `pnpm db:migrate` so we don't pay a roundtrip per
  // serverless cold start.
  if (!_migrationsApplied && url.startsWith('file:')) {
    const migrationsFolder = resolve(fileURLToPath(new URL('./migrations', import.meta.url)));
    if (existsSync(migrationsFolder)) {
      void runMigrations(_db, { migrationsFolder })
        .then(() => {
          _migrationsApplied = true;
        })
        .catch((err) => {
          console.error('[db] auto-migrate failed', err);
        });
    }
  }

  return _db;
}

export function closeDb(): void {
  _client?.close();
  _db = null;
  _client = null;
  _migrationsApplied = false;
}

export { schema };
export type Db = ReturnType<typeof getDb>;
