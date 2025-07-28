/*
  Warnings:

  - You are about to drop the `comment_reactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "comment_reactions" DROP CONSTRAINT "comment_reactions_commentId_fkey";

-- DropForeignKey
ALTER TABLE "comment_reactions" DROP CONSTRAINT "comment_reactions_userId_fkey";

-- DropTable
DROP TABLE "comment_reactions";
