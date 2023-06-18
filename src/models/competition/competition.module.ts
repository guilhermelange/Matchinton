import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';

@Module({
  controllers: [CompetitionController],
  providers: [CompetitionService],
})
export class CompetitionModule {}
