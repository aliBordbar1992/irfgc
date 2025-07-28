/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- Add username column as nullable first
ALTER TABLE "users" ADD COLUMN "username" TEXT;

-- Update existing users to use email as username (before email was unique, so this should be safe)
UPDATE "users" SET "username" = "email" WHERE "username" IS NULL;

-- Make username NOT NULL and email nullable
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
