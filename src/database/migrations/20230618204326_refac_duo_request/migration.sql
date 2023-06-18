/*
  Warnings:

  - You are about to drop the `duo_request_candidates` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `duo_request` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('MAS', 'FEM');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DENIED', 'CANCELED', 'DISREGARDED');

-- DropForeignKey
ALTER TABLE "duo_request_candidates" DROP CONSTRAINT "duo_request_candidates_request_id_fkey";

-- DropForeignKey
ALTER TABLE "duo_request_candidates" DROP CONSTRAINT "duo_request_candidates_user_id_fkey";

-- AlterTable
ALTER TABLE "competition" ADD COLUMN     "type" "requesttype" NOT NULL DEFAULT 'MIS';

-- AlterTable
ALTER TABLE "duo_request" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL;

-- AlterTable
ALTER TABLE "player" ADD COLUMN     "gender" "UserGender" NOT NULL DEFAULT 'MAS';

-- DropTable
DROP TABLE "duo_request_candidates";
