import type { Config } from 'drizzle-kit';

const url = process.env.DATABASE_URL ?? 'file:./.data/mmbgims.db';
const isRemote = !url.startsWith('file:');

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'sqlite',
  driver: isRemote ? 'turso' : undefined,
  dbCredentials: {
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config;
