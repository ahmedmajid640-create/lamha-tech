import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton (safe across Next.js hot reloads and serverless invocations).
 * Only instantiated when DATABASE_URL is configured; see repositories.ts for the
 * file-based development fallback.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPrisma(): PrismaClient {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }
  // DIRECT_URL is only needed by the Prisma CLI; default it so runtime validation never fails.
  if (!process.env.DIRECT_URL) process.env.DIRECT_URL = process.env.DATABASE_URL;

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}
