/*
  Warnings:

  - You are about to drop the column `reactionType` on the `reactions` table. All the data in the column will be lost.
  - Added the required column `emoji` to the `reactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "reactionType",
ADD COLUMN     "emoji" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ReactionType";
