import { defineConfig, devices } from "@playwright/test";

const apiPort = process.env.E2E_API_PORT ?? "8082";
const appPort = Number(process.env.E2E_APP_PORT ?? 3102);

/** Runs the journeys against the real backend and a production build. */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  globalSetup: "./tests/e2e/support/global-setup.ts",
  use: { baseURL: `http://localhost:${appPort}`, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: `E2E_APP_PORT=${appPort} ./scripts/e2e-backend.sh`,
      url: `http://localhost:${apiPort}/healthz`,
      timeout: 180_000,
      reuseExistingServer: false,
    },
    {
      command:
        `NEXT_DIST_DIR=.next-e2e ZELLAPAY_API_URL=http://localhost:${apiPort} ` +
        `sh -c "pnpm exec next build && pnpm exec next start -p ${appPort}"`,
      url: `http://localhost:${appPort}/fr/sign-in`,
      timeout: 300_000,
      reuseExistingServer: false,
    },
  ],
});
