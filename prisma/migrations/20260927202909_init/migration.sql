-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'QUALIFIED', 'CONTACTED', 'PROPOSAL', 'WON', 'LOST', 'SPAM');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'REPLIED', 'CLOSED', 'SPAM');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSED', 'DRAFT', 'DEMO');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED', 'HIRED');

-- CreateTable
CREATE TABLE "ProjectInquiry" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "projectName" TEXT,
    "service" TEXT NOT NULL,
    "industry" TEXT,
    "description" TEXT NOT NULL,
    "stage" TEXT,
    "budget" TEXT,
    "timeline" TEXT,
    "consent" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website:start-a-project',
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "userAgent" TEXT,
    "referer" TEXT,
    "locale" TEXT,
    "crmId" TEXT,
    "linkedOutId" TEXT,
    "dialerId" TEXT,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAttachment" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "storageProvider" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website:contact',
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "userAgent" TEXT,
    "referer" TEXT,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT[],
    "requirements" TEXT[],
    "niceToHave" TEXT[],
    "benefits" TEXT[],
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "jobId" TEXT,
    "roleSlug" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "portfolio" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "coverLetter" TEXT,
    "cvOriginalName" TEXT,
    "cvStorageProvider" TEXT,
    "cvStorageKey" TEXT,
    "cvUrl" TEXT,
    "cvSize" INTEGER,
    "cvMimeType" TEXT,
    "consent" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website:careers',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "userAgent" TEXT,
    "referer" TEXT,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectInquiry_createdAt_idx" ON "ProjectInquiry"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectInquiry_email_idx" ON "ProjectInquiry"("email");

-- CreateIndex
CREATE INDEX "ProjectInquiry_status_idx" ON "ProjectInquiry"("status");

-- CreateIndex
CREATE INDEX "ProjectAttachment_inquiryId_idx" ON "ProjectAttachment"("inquiryId");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");

-- CreateIndex
CREATE INDEX "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");

-- CreateIndex
CREATE INDEX "JobApplication_roleSlug_idx" ON "JobApplication"("roleSlug");

-- AddForeignKey
ALTER TABLE "ProjectAttachment" ADD CONSTRAINT "ProjectAttachment_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "ProjectInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
