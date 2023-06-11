import { Controller, Post, Body } from '@nestjs/common';
import { WhatsService } from './whats.service';
import { CreateWhatDto } from './dto/create-what.dto';

@Controller('whats')
export class WhatsController {
  constructor(private readonly whatsService: WhatsService) {}

  @Post()
  send(@Body() createWhatDto: CreateWhatDto) {
    return this.whatsService.send(createWhatDto);
  }
}
