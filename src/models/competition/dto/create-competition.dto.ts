import { requesttype } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateCompetitionDto {
  id: bigint;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  start_date: Date;

  @IsNotEmpty()
  end_date: Date;

  @IsNotEmpty()
  categories: number[];

  @IsNotEmpty()
  type: requesttype;
}
