import { defineConfig, devices } from "@playwright/test";

const port = 4173;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  reporter: "line",
  timeout: 30_000,
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry"
  },
  webServer: {
    command: `pnpm --dir apps/web exec vite --host 127.0.0.1 --port ${port} --strictPort`,
    reuseExistingServer: true,
    timeout: 120_000,
    url: baseURL
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
