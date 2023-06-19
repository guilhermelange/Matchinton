/*
  Warnings:

  - You are about to drop the column `category_id` on the `duo_request` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `duo_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "duo_request" DROP COLUMN "category_id",
DROP COLUMN "type";
