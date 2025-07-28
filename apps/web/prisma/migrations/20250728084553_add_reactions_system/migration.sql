-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('HEART', 'THUMBS_UP', 'THUMBS_DOWN', 'LAUGH', 'SAD', 'ANGRY', 'SURPRISED', 'FIRE', 'ROCKET', 'EYES');

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "reactionType" "ReactionType" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reactions_contentId_contentType_idx" ON "reactions"("contentId", "contentType");

-- CreateIndex
CREATE INDEX "reactions_userId_idx" ON "reactions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_contentId_contentType_userId_key" ON "reactions"("contentId", "contentType", "userId");

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
