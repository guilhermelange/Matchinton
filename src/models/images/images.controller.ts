import { Controller, Get, Param } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Public } from 'src/common/decorator/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':image')
  @Public()
  findOne(@Param('image') image: string) {
    return this.imagesService.findOne(image);
  }
}
