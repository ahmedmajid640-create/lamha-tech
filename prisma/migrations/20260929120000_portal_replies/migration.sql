-- CreateEnum
CREATE TYPE "ReplyStatus" AS ENUM ('SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Reply" (
    "id" TEXT NOT NULL,
    "entityType" "NoteEntity" NOT NULL,
    "entityId" TEXT NOT NULL,
    "authorId" TEXT,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "ReplyStatus" NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reply_entityType_entityId_idx" ON "Reply"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Reply_authorId_idx" ON "Reply"("authorId");

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
