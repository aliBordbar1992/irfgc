-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "news_posts" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
