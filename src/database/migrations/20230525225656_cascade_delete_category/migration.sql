-- DropForeignKey
ALTER TABLE "competition_category" DROP CONSTRAINT "competition_category_category_id_fkey";

-- DropForeignKey
ALTER TABLE "competition_category" DROP CONSTRAINT "competition_category_competition_id_fkey";

-- AddForeignKey
ALTER TABLE "competition_category" ADD CONSTRAINT "competition_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "competition_category" ADD CONSTRAINT "competition_category_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
