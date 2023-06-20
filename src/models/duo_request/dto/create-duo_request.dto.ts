import { IsNotEmpty } from 'class-validator';

export class CreateDuoRequestDto {
  @IsNotEmpty()
  player1: bigint;

  @IsNotEmpty()
  player2: bigint;

  @IsNotEmpty()
  competition: bigint;
}
