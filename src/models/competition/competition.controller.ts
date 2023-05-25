import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';

@Controller('competition')
@UseGuards(AdminGuard)
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Post()
  create(@Body() createCompetitionDto: CreateCompetitionDto) {
    return this.competitionService.create(createCompetitionDto);
  }

  @Get()
  findAll() {
    return this.competitionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompetitionDto: UpdateCompetitionDto,
  ) {
    return this.competitionService.update(+id, updateCompetitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitionService.remove(+id);
  }
}
