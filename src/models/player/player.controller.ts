import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto, SearchPlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import multerConfig from 'src/common/storage/multer.config';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: multerConfig.destination,
      }),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    return this.playerService.updateImage(+id, file);
  }

  @Get('/team/:id')
  @UseInterceptors(FileInterceptor('file'))
  findAll(@Param('id') team_id: string) {
    return this.playerService.findAll(+team_id);
  }

  @Get('search')
  search(@Body() searchPlayerDto: SearchPlayerDto) {
    return this.playerService.search(searchPlayerDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(+id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerService.remove(+id);
  }
}
