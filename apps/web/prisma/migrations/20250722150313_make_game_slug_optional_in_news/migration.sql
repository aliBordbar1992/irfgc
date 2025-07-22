-- DropForeignKey
ALTER TABLE "news_posts" DROP CONSTRAINT "news_posts_gameSlug_fkey";

-- AlterTable
ALTER TABLE "news_posts" ALTER COLUMN "gameSlug" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "news_posts" ADD CONSTRAINT "news_posts_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "games"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
