-- AddForeignKey
ALTER TABLE "duo_request" ADD CONSTRAINT "fk_competition_duo_request" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "duo_request" ADD CONSTRAINT "fk_player1" FOREIGN KEY ("player1") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "duo_request" ADD CONSTRAINT "fk_player2" FOREIGN KEY ("player2") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
