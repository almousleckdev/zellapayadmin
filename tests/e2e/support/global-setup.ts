import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { staff } from "./accounts";

const backend = resolve(__dirname, "../../../../zellapay");

function backendEnv(): NodeJS.ProcessEnv {
  const pairs = readFileSync(resolve(backend, ".env.local"), "utf8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]);
  return {
    ...process.env,
    ...Object.fromEntries(pairs),
    ZP_ADMIN_URL: `http://localhost:${process.env.E2E_APP_PORT ?? 3102}`,
    ZP_STAFF_PASSWORD: staff.phrase,
    ZP_DATABASE_URL:
      "postgres://zellapay:zellapay-local-only@127.0.0.1:5433/zp_e2e_admin?sslmode=disable",
  };
}

/** Creates the administrator the journeys sign in as. */
export default function globalSetup(): void {
  execFileSync(
    "go",
    ["run", "./cmd/zellactl", "staff", "create-super-admin", staff.email, staff.name],
    { cwd: backend, env: backendEnv(), encoding: "utf8" },
  );
}
