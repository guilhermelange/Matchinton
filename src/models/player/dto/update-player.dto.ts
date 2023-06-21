import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePlayerDto {

    @IsNumber()
    @IsNotEmpty()
    team_id: bigint;

}
