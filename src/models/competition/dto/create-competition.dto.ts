import { competition } from '@prisma/client';

export class CreateCompetitionDto implements competition {
  id: bigint;
  name: string;
  start_date: Date;
  end_date: Date;
  competition_category: number[];
}
