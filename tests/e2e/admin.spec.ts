import { test, expect } from '@playwright/test';

test.describe('Admin dashboard', () => {
  test('signs in with demo credentials and seeds demo data', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('h2')).toContainText('Welcome back');

    // Demo creds prefill, but submit anyway
    await page.fill('#login-email', 'director@mmbgims.com');
    await page.fill('#login-password', 'bgims2026');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin/dashboard');
    await expect(page.locator('#cmsTitle')).toHaveText('Overview');

    // Switch to Applications tab — Seed button lives there
    await page.click('a[data-tab="applications"]');
    await expect(page.locator('#cmsTitle')).toHaveText('Applications');

    await page.click('#seedDemo');
    await expect(page.locator('#kpiApps')).toHaveText('12');
    await expect(page.locator('#kpiEnq')).toHaveText('4');
    await expect(page.locator('#appCountBadge')).toHaveText('12');
  });

  test('rejects bad credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#login-email', 'noone@example.com');
    await page.fill('#login-password', 'wrongwrong');
    await page.click('button[type="submit"]');
    await expect(page.locator('#loginError')).toBeVisible();
  });

  test('redirects unauthenticated users from the dashboard to login', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/admin/dashboard');
    // Client-side gate redirects via location.href; allow time for it
    await page.waitForURL('**/admin/login', { timeout: 5_000 });
  });
});
