import { Module } from '@nestjs/common';
import { DuoRequestService } from './duo_request.service';
import { DuoRequestController } from './duo_request.controller';

@Module({
  controllers: [DuoRequestController],
  providers: [DuoRequestService]
})
export class DuoRequestModule {}
