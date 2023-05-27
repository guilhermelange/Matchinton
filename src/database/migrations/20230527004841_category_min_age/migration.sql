/*
  Warnings:

  - Added the required column `min_age` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "min_age" INTEGER NOT NULL;
