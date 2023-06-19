import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DuoRequestService } from './duo_request.service';
import { CreateDuoRequestDto } from './dto/create-duo_request.dto';
import { UpdateDuoRequestDto } from './dto/update-duo_request.dto';

@Controller('duo-request')
export class DuoRequestController {
  constructor(private readonly duoRequestService: DuoRequestService) {}

  @Post()
  create(@Body() createDuoRequestDto: CreateDuoRequestDto) {
    return this.duoRequestService.create(createDuoRequestDto);
  }

  @Patch()
  update(@Body() updateDuoRequestDto: UpdateDuoRequestDto) {
    return this.duoRequestService.update(updateDuoRequestDto);
  }

}
