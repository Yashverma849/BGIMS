import { test, expect } from '@playwright/test';

const PUBLIC_PATHS = [
  '/',
  '/about',
  '/programs',
  '/placements',
  '/faculty',
  '/events',
  '/alumni',
  '/contact',
  '/admissions',
  '/apply',
];

test.describe('Public pages render', () => {
  for (const path of PUBLIC_PATHS) {
    test(`${path} returns 200 with MM BGIMS in <title>`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(/MM BGIMS/);
      // Nav + footer present on every public page
      await expect(page.locator('nav.nav')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });
  }

  test('Home shows the hero headline and stats', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero__title')).toContainText('Where');
    await expect(page.locator('.hero__title')).toContainText('heritage');
    await expect(page.locator('.stat')).toHaveCount(4);
  });

  test('Faculty page lists 8 core faculty', async ({ page }) => {
    await page.goto('/faculty');
    const cards = page.locator('.faculty-card');
    await expect(cards).toHaveCount(8);
  });

  test('404 page renders for an unknown path', async ({ page }) => {
    const res = await page.goto('/this-does-not-exist');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('misplaced');
  });
});
