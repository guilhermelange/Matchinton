import { Module } from '@nestjs/common';
import { DuoRequestService } from './duo_request.service';
import { DuoRequestController } from './duo_request.controller';
import { EmailService } from '../email/email.service';

@Module({
  controllers: [DuoRequestController],
  providers: [DuoRequestService, EmailService],
})
export class DuoRequestModule {}
