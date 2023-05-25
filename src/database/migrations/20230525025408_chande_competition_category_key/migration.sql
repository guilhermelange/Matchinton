/*
  Warnings:

  - The primary key for the `competition_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `competition_category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "competition_category" DROP CONSTRAINT "competition_category_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "competition_category_pkey" PRIMARY KEY ("category_id", "competition_id");
