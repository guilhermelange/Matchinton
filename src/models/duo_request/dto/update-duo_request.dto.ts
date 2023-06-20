import { RequestStatus } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class UpdateDuoRequestDto {
  @IsNotEmpty()
  status: RequestStatus;

  @IsNotEmpty()
  player: bigint;
}
