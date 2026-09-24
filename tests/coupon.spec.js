const { test, expect } = require("@playwright/test");

test("valid coupon applies 20 percent discount", async ({ page }) => {

  await page.goto("/");

  // Enter coupon
  await page.fill("#coupon", "SAVE20");

  // Apply coupon
  await page.click("#apply-coupon");

  // Verify coupon was accepted
  await expect(page.locator("#coupon-message"))
    .toContainText("Coupon applied successfully!");

  // Verify 20% discount
  await expect(page.locator("#discount"))
    .toHaveText("₹200");

  // Verify final total
  await expect(page.locator("#total"))
    .toHaveText("₹800");

});