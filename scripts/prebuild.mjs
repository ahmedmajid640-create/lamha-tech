// Runs before `next build`:
//   1. always generate the Prisma client
//   2. apply pending migrations when a database is configured (Vercel/CI builds)
import { execSync } from "node:child_process";

const run = (cmd) => {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

// Local convenience: pick up .env when present. Never on Vercel/CI, where real env vars are injected.
for (const file of process.env.VERCEL || process.env.CI ? [] : [".env", ".env.local"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    /* file absent */
  }
}

run("prisma generate");

if (process.env.DATABASE_URL) {
  if (!process.env.DIRECT_URL) process.env.DIRECT_URL = process.env.DATABASE_URL;
  if (process.env.SKIP_DB_MIGRATE === "1") {
    console.log("SKIP_DB_MIGRATE=1 — skipping prisma migrate deploy");
  } else {
    run("prisma migrate deploy");
  }
} else {
  console.log("DATABASE_URL not set — skipping migrations (file-based persistence will be used).");
}
