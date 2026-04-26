import { test, expect } from '@playwright/test';

test.describe('Admin auth + dashboard', () => {
  test('redirects unauthenticated users from the dashboard to login with a `next` param', async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto('/admin/dashboard');
    await page.waitForURL(/\/admin\/login/);
    expect(page.url()).toContain('/admin/login');
    expect(page.url()).toContain('next=');
  });

  test('rejects bad credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#login-email', 'noone@example.com');
    await page.fill('#login-password', 'wrongwrong');
    await page.click('button[type="submit"]');
    await expect(page.locator('#loginError')).toBeVisible();
  });

  test('signs in with seeded credentials, lands on dashboard, seeds demo, signs out', async ({
    page,
  }) => {
    await page.goto('/admin/login');
    await page.fill('#login-email', 'director@mmbgims.com');
    await page.fill('#login-password', 'bgims2026');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin/dashboard');
    await expect(page.locator('#cmsTitle')).toHaveText('Overview');
    await expect(page.locator('#userEmail')).toHaveText('director@mmbgims.com');

    await page.click('a[data-tab="applications"]');
    await expect(page.locator('#cmsTitle')).toHaveText('Applications');
    await page.click('#seedDemo');

    await expect(page.locator('#kpiApps')).toHaveText('12', { timeout: 10_000 });
    await expect(page.locator('#kpiEnq')).toHaveText('4');
    await expect(page.locator('#appCountBadge')).toHaveText('12');

    await page.click('#signOut');
    await page.waitForURL(/\/admin\/login/);
  });
});
