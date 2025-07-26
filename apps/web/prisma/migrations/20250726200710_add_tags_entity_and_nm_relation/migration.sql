/*
  Warnings:

  - You are about to drop the column `tags` on the `news_posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "news_posts" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_post_tags" (
    "id" TEXT NOT NULL,
    "newsPostId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "news_post_tags_newsPostId_tagId_key" ON "news_post_tags"("newsPostId", "tagId");

-- AddForeignKey
ALTER TABLE "news_post_tags" ADD CONSTRAINT "news_post_tags_newsPostId_fkey" FOREIGN KEY ("newsPostId") REFERENCES "news_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_post_tags" ADD CONSTRAINT "news_post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
