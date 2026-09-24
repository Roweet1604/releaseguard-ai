const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",

  use: {
    baseURL: "http://localhost:3001",

    screenshot: "only-on-failure",

    trace: "retain-on-failure",

    video: "retain-on-failure",

    headless: true,
  },

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
});