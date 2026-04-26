import { test, expect } from '@playwright/test';

test.describe('Public API', () => {
  test('/api/health returns 200 with status ok', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  test('/api/enquiries accepts a valid enquiry (DB-backed)', async ({ request }) => {
    const res = await request.post('/api/enquiries', {
      data: {
        name: 'E2E Public',
        email: `e2e+${Date.now()}@example.com`,
        message: 'Persisted via Playwright',
        programme: 'MMS',
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toMatch(/^ENQ-/);
  });

  test('/api/enquiries rejects malformed body with 422', async ({ request }) => {
    const res = await request.post('/api/enquiries', { data: { email: 'not-an-email' } });
    expect(res.status()).toBe(422);
  });

  test('/api/admin/* without a session returns 401', async ({ request }) => {
    const apps = await request.get('/api/admin/applications');
    expect(apps.status()).toBe(401);
    const enqs = await request.get('/api/admin/enquiries');
    expect(enqs.status()).toBe(401);
  });

  test('/api/auth/login → /api/auth/me → /api/auth/logout round-trip', async ({ request }) => {
    const login = await request.post('/api/auth/login', {
      data: { email: 'director@mmbgims.com', password: 'bgims2026' },
    });
    expect(login.status()).toBe(200);

    const me = await request.get('/api/auth/me');
    expect(me.status()).toBe(200);
    const meBody = await me.json();
    expect(meBody.email).toBe('director@mmbgims.com');

    const apps = await request.get('/api/admin/applications');
    expect(apps.status()).toBe(200);

    const out = await request.post('/api/auth/logout');
    expect(out.status()).toBe(200);

    const after = await request.get('/api/auth/me');
    expect(after.status()).toBe(401);
  });

  test('/api/auth/login rejects invalid credentials with 401', async ({ request }) => {
    const res = await request.post('/api/auth/login', {
      data: { email: 'wrong@example.com', password: 'wrongwrong' },
    });
    expect(res.status()).toBe(401);
  });

  test('/api/* rate-limits aggressive callers (20/min)', async ({ request }) => {
    let rateLimited = false;
    for (let i = 0; i < 30; i++) {
      const res = await request.post('/api/enquiries', {
        data: { name: 'Spam', email: 'spam@example.com', message: String(i) },
      });
      if (res.status() === 429) {
        rateLimited = true;
        break;
      }
    }
    expect(rateLimited).toBe(true);
  });
});
