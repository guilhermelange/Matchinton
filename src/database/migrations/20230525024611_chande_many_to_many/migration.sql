/*
  Warnings:

  - The primary key for the `competition_category` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "competition_category" DROP CONSTRAINT "competition_category_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "competition_category_pkey" PRIMARY KEY ("id");
