/**
 * Database client — libSQL.
 *
 * One driver, three homes:
 *   - Local / self-hosted Node:  DATABASE_URL=file:./.data/mmbgims.db (default)
 *   - Vercel / Netlify with Turso:
 *       DATABASE_URL=libsql://<your-db>.turso.io
 *       DATABASE_AUTH_TOKEN=<turso token>
 *   - Vercel without Turso (auto-fallback): :memory: per cold start so the
 *     site stays up; data does NOT persist between requests/instances. The
 *     console warns once so it's not a silent footgun.
 *
 * Migrations are applied lazily on connection for file:// and :memory: so
 * `pnpm start` and the Vercel fallback both work out of the box. For
 * hosted Turso, run `pnpm db:migrate` once after deploy (see README).
 */

import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate as runMigrations } from 'drizzle-orm/libsql/migrator';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from './schema';

const DEFAULT_LOCAL_FILE = './.data/mmbgims.db';

interface ResolvedUrl {
  url: string;
  kind: 'file' | 'memory' | 'remote';
}

let _warned = false;

function resolveUrl(): ResolvedUrl {
  const raw = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;
  const onServerless =
    process.env.VERCEL === '1' || !!process.env.VERCEL_ENV || !!process.env.NETLIFY;

  const isSupabase = raw && raw.includes('supabase.co');

  if (raw && !isSupabase && (raw.startsWith('libsql://') || raw.startsWith('https://'))) {
    return { url: raw, kind: 'remote' };
  }

  if (raw && raw.startsWith('file:')) {
    const path = raw.slice('file:'.length);
    const absolute = resolve(process.cwd(), path);
    try {
      mkdirSync(dirname(absolute), { recursive: true });
      return { url: `file:${absolute}`, kind: 'file' };
    } catch {
      // Read-only filesystem — fall through to memory below.
    }
  }

  if (onServerless) {
    if (!_warned) {
      console.warn(
        '[db] DATABASE_URL not set on serverless host — using in-memory libSQL. ' +
          'Data will NOT persist between requests/instances. Set DATABASE_URL=libsql://… ' +
          'and DATABASE_AUTH_TOKEN to point at a Turso DB.',
      );
      _warned = true;
    }
    return { url: ':memory:', kind: 'memory' };
  }

  const absolute = resolve(process.cwd(), DEFAULT_LOCAL_FILE);
  mkdirSync(dirname(absolute), { recursive: true });
  return { url: `file:${absolute}`, kind: 'file' };
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _client: Client | null = null;
let _migrationsApplied = false;

export function getDb() {
  if (_db) return _db;
  const { url, kind } = resolveUrl();
  _client = createClient({
    url,
    authToken: import.meta.env.DATABASE_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
  });
  _db = drizzle(_client, { schema });

  // Auto-migrate on file:// and :memory: — for hosted Turso, migrations
  // should be applied out-of-band via `pnpm db:migrate` so we don't pay a
  // roundtrip per cold start.
  if (!_migrationsApplied && (kind === 'file' || kind === 'memory')) {
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
