import { UserGender } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  observation: string;

  @IsNotEmpty()
  birth_date: Date;
  photo?: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNumber()
  @IsNotEmpty()
  team_id: bigint;

  @IsNotEmpty()
  gender: UserGender;
}

export class SearchPlayerDto {
  @IsNumber()
  @IsNotEmpty()
  team_id: bigint;
  name?: string;
  categories?: number[];
}
