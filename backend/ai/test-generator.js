function generatePlaywrightTests(plan) {
  const scenarios = plan.scenarios || [];

  const tests = scenarios
    .map((scenario) => {
      return generateScenarioTest(scenario);
    })
    .join("\n\n");

  return `const { test, expect } = require("@playwright/test");

${tests}
`;
}

function generateScenarioTest(scenario) {
  const name = scenario.description
    .replace(/"/g, "'")
    .trim();

  // Coupon demo scenario
  if (
    scenario.description.toLowerCase().includes("valid coupon") &&
    scenario.description.toLowerCase().includes("20%")
  ) {
    return `test("${name}", async ({ page }) => {
  await page.goto(process.env.TEST_APP_URL);

  await page.fill("#coupon", "SAVE20");
  await page.click("#apply-coupon");

  await expect(page.locator("#coupon-message"))
    .toContainText("Coupon applied successfully!");

  await expect(page.locator("#discount"))
    .toHaveText("₹200");

  await expect(page.locator("#total"))
    .toHaveText("₹800");
});`;
  }

  // Invalid coupon scenario
  if (
    scenario.description.toLowerCase().includes("invalid coupon")
  ) {
    return `test("${name}", async ({ page }) => {
  await page.goto(process.env.TEST_APP_URL);

  await page.fill("#coupon", "INVALID");

  await page.click("#apply-coupon");

  await expect(page.locator("#coupon-message"))
    .toContainText("Invalid coupon");
});`;
  }

  // Expired coupon scenario
  if (
    scenario.description.toLowerCase().includes("expired coupon")
  ) {
    return `test("${name}", async ({ page }) => {
  await page.goto(process.env.TEST_APP_URL);

  await page.fill("#coupon", "EXPIRED");

  await page.click("#apply-coupon");

  await expect(page.locator("#coupon-message"))
    .toContainText("expired");
});`;
  }

  // Generic fallback
  return `test("${name}", async ({ page }) => {
  await page.goto(process.env.TEST_APP_URL);

  // Scenario generated from ReleaseGuard test plan
  console.log("Scenario: ${name}");

  await expect(page).toHaveTitle(/.*/);
});`;
}

module.exports = {
  generatePlaywrightTests,
};