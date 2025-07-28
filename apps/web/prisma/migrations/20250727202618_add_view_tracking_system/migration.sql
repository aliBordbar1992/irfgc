-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContentType" ADD VALUE 'NEWS';
ALTER TYPE "ContentType" ADD VALUE 'POST';
ALTER TYPE "ContentType" ADD VALUE 'EVENT';

-- CreateTable
CREATE TABLE "view_events" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "userId" TEXT,
    "anonId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dedupHash" TEXT NOT NULL,

    CONSTRAINT "view_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "view_events_contentId_contentType_dedupHash_viewedAt_idx" ON "view_events"("contentId", "contentType", "dedupHash", "viewedAt");
