import { defineConfig, devices } from "@playwright/test";
const ci = !!process.env.CI;
export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  reporter: ci ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://127.0.0.1:4322", trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "npm run start -- --port 4322",
    url: "http://127.0.0.1:4322",
    reuseExistingServer: !ci,
  },
});
