/**
 * Seeds the Job table from the CMS-ready data file. Idempotent (upsert by slug).
 * Run: npm run db:seed   (Node 24 runs TypeScript directly)
 */
import { PrismaClient } from "@prisma/client";
import { jobs } from "../src/data/jobs.ts";

const prisma = new PrismaClient();

async function main() {
  for (const job of jobs) {
    const data = {
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      summary: job.summary,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      niceToHave: job.niceToHave,
      benefits: job.benefits,
      status: job.status.toUpperCase() as "OPEN" | "CLOSED" | "DRAFT" | "DEMO",
    };
    await prisma.job.upsert({ where: { slug: job.slug }, create: { slug: job.slug, ...data }, update: data });
    console.log(`seeded job: ${job.slug} (${data.status})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
