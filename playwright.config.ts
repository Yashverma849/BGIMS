import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 4321);
const HOST = process.env.HOST ?? '127.0.0.1';
const baseURL = `http://${HOST}:${PORT}`;

// Tests share one Node server + one SQLite file. We single-thread to keep
// the DB and the in-memory rate-limit bucket deterministic. The webServer
// command resets the DB and re-seeds the Director user before booting.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command:
      'rm -rf .data/mmbgims.db .data/mmbgims.db-wal .data/mmbgims.db-shm && pnpm db:migrate && pnpm db:seed && node ./server.mjs',
    env: {
      HOST,
      PORT: String(PORT),
      SESSION_SECRET: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      DATABASE_URL: './.data/mmbgims.db',
    },
    url: `${baseURL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
