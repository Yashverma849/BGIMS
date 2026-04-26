import { test, expect } from '@playwright/test';

test.describe('Apply flow', () => {
  test('walks the 5-step application and processes a mock payment', async ({ page }) => {
    await page.goto('/apply');

    // Step 1 — personal
    await page.fill('#f-fname', 'Aanya');
    await page.fill('#f-lname', 'Iyer');
    await page.fill('#f-email', 'aanya@example.com');
    await page.fill('#f-phone', '+91 9819990000');
    await page.fill('#f-dob', '2002-04-12');
    await page.selectOption('#f-gender', 'Female');
    await page.fill('#f-addr', '12 Marine Drive, Mumbai');
    await page.fill('#f-city', 'Mumbai');
    await page.fill('#f-state', 'Maharashtra');
    await page.fill('#f-pin', '400020');
    await page.click('[data-next="2"]');
    await expect(page.locator('.apply-step[data-step="2"]')).toBeVisible();

    // Step 2 — academic
    await page.fill('input[name="x_board"]', 'CBSE');
    await page.fill('input[name="x_year"]', '2018');
    await page.fill('input[name="x_score"]', '92%');
    await page.fill('input[name="xii_board"]', 'CBSE');
    await page.fill('input[name="xii_year"]', '2020');
    await page.fill('input[name="xii_score"]', '89%');
    await page.click('[data-next="3"]');
    await expect(page.locator('.apply-step[data-step="3"]')).toBeVisible();

    // Step 3 — programme
    await page.check('input[name="programme"][value="MBA-BF"]');
    await page.click('[data-next="4"]');
    await expect(page.locator('.apply-step[data-step="4"]')).toBeVisible();

    // Step 4 — documents (skip uploads, just continue)
    await page.click('[data-next="5"]');
    await expect(page.locator('.apply-step[data-step="5"]')).toBeVisible();

    // Step 5 — payment summary should reflect MBA fee + GST
    await expect(page.locator('#pay-fee')).toContainText('₹1,500.00');
    await expect(page.locator('#pay-gst')).toContainText('₹270.00');
    await expect(page.locator('#pay-total')).toContainText('₹1,770.00');

    // Trigger the mock Razorpay handshake
    await page.click('#payNow');
    await expect(page.locator('#rzpModal')).toHaveClass(/is-open/);

    // Wait for the simulated 3.2s handshake to complete
    await expect(page.locator('#rzpSuccess')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('#appId')).toContainText(/^BGIMS-/);
    await expect(page.locator('#rcptPayId')).toContainText(/^pay_/);
    await expect(page.locator('#rcptProg')).toContainText('MBA · Banking & Finance');
  });
});
