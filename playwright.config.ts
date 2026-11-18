import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3108", trace: "retain-on-failure" },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], timezoneId: "UTC" },
    },
    { name: "mobile", use: { ...devices["Pixel 7"], timezoneId: "UTC" } },
  ],
  webServer: {
    command:
      "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3108",
    url: "http://127.0.0.1:3108/auth/sign-in",
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      // Deliberately inert test configuration. No production auth bypass exists.
      NEON_AUTH_BASE_URL: "http://127.0.0.1:9/auth",
      NEON_AUTH_COOKIE_SECRET:
        "test-only-cookie-signing-value-at-least-32-chars",
      MEAL_PLANNER_OWNER_EMAIL: "owner@example.com",
      DATABASE_URL: "postgresql://unused:unused@127.0.0.1:9/unused",
      APP_ORIGIN: "http://127.0.0.1:3108",
    },
  },
});
