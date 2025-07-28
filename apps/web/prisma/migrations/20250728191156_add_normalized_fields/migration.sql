/*
  Warnings:

  - A unique constraint covering the columns `[usernameNormalized]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emailNormalized]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usernameNormalized` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- Add normalized fields as nullable first
ALTER TABLE "users" ADD COLUMN "emailNormalized" TEXT,
ADD COLUMN "usernameNormalized" TEXT;

-- Populate normalized fields from existing data
UPDATE "users" SET 
  "usernameNormalized" = LOWER("username"),
  "emailNormalized" = CASE WHEN "email" IS NOT NULL THEN LOWER("email") ELSE NULL END;

-- Make usernameNormalized NOT NULL
ALTER TABLE "users" ALTER COLUMN "usernameNormalized" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_usernameNormalized_key" ON "users"("usernameNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "users_emailNormalized_key" ON "users"("emailNormalized");
