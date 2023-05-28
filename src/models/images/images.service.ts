import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  findOne(image: string) {
    const filename = join(__dirname, '..', '..', '..', 'upload', image);
    const file = createReadStream(filename);
    return new StreamableFile(file);
  }
}
