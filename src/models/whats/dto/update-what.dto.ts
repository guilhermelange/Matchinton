import { PartialType } from '@nestjs/mapped-types';
import { CreateWhatDto } from './create-what.dto';

export class UpdateWhatDto extends PartialType(CreateWhatDto) {}
