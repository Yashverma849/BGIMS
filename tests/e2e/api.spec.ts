import { test, expect } from '@playwright/test';

test.describe('API routes', () => {
  test('/api/health returns 200 with status ok', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(typeof body.timestamp).toBe('string');
  });

  test('/api/enquiries accepts a well-formed enquiry', async ({ request }) => {
    const res = await request.post('/api/enquiries', {
      data: {
        name: 'E2E Test',
        email: 'e2e@example.com',
        message: 'A test enquiry from the Playwright suite.',
        programme: 'MMS',
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toMatch(/^ENQ-/);
    expect(body.email).toBe('e2e@example.com');
  });

  test('/api/enquiries rejects a malformed enquiry with 422', async ({ request }) => {
    const res = await request.post('/api/enquiries', {
      data: { email: 'not-an-email' },
    });
    expect(res.status()).toBe(422);
  });

  test('/api/enquiries rate-limits aggressive callers', async ({ request }) => {
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
