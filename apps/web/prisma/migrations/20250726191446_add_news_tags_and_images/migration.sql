-- AlterTable
ALTER TABLE "news_posts" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "thumbnail" TEXT;
