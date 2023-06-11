import { Module } from '@nestjs/common';
import { WhatsService } from './whats.service';
import { WhatsController } from './whats.controller';

@Module({
  controllers: [WhatsController],
  providers: [WhatsService],
})
export class WhatsModule {}
