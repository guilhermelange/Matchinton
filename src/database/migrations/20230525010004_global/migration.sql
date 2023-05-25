-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "requesttype" AS ENUM ('MAS', 'FEM', 'MIS');

-- CreateTable
CREATE TABLE "user" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "type" "UserType" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "max_age" INTEGER NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,

    CONSTRAINT "competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competition_category" (
    "category_id" BIGINT NOT NULL,
    "competition_id" BIGINT NOT NULL,

    CONSTRAINT "competition_category_pkey" PRIMARY KEY ("category_id","competition_id")
);

-- CreateTable
CREATE TABLE "duo_request" (
    "id" BIGSERIAL NOT NULL,
    "player1" BIGINT NOT NULL,
    "player2" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,
    "competition_id" BIGINT NOT NULL,
    "status" INTEGER NOT NULL,
    "type" "requesttype" NOT NULL,

    CONSTRAINT "duo_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duo_request_candidates" (
    "request_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "duo_request_candidates_pkey" PRIMARY KEY ("request_id","user_id")
);

-- CreateTable
CREATE TABLE "player" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "photo" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "team_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_team" (
    "user_id" BIGINT NOT NULL,
    "team_id" BIGINT NOT NULL,

    CONSTRAINT "user_team_pkey" PRIMARY KEY ("user_id","team_id")
);

-- AddForeignKey
ALTER TABLE "competition_category" ADD CONSTRAINT "competition_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "competition_category" ADD CONSTRAINT "competition_category_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "duo_request_candidates" ADD CONSTRAINT "duo_request_candidates_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "duo_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "duo_request_candidates" ADD CONSTRAINT "duo_request_candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
