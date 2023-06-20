import { Controller, Post, Body, Patch, Param, Get, Req } from '@nestjs/common';
import { DuoRequestService } from './duo_request.service';
import { CreateDuoRequestDto } from './dto/create-duo_request.dto';
import { UpdateDuoRequestDto } from './dto/update-duo_request.dto';
import { Request } from 'express';

@Controller('duo-request')
export class DuoRequestController {
  constructor(private readonly duoRequestService: DuoRequestService) {}

  @Get()
  findAll(@Req() request: Request) {
    const { competition_id, player1, player2, player, team_id, status } =
      request.query;
    return this.duoRequestService.findAll({
      competition_id: competition_id ? +competition_id : undefined,
      player1: player1 ? +player1 : undefined,
      player2: player2 ? +player2 : undefined,
      team_id: team_id ? +team_id : undefined,
      player: player ? +player : undefined,
      status: status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.duoRequestService.findOne(+id);
  }

  @Post()
  create(@Body() createDuoRequestDto: CreateDuoRequestDto) {
    return this.duoRequestService.create(createDuoRequestDto);
  }

  @Patch(':id')
  update(
    @Body() updateDuoRequestDto: UpdateDuoRequestDto,
    @Param('id') id: string,
  ) {
    return this.duoRequestService.update(updateDuoRequestDto, +id);
  }
}
