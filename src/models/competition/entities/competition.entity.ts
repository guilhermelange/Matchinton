import { competition } from '@prisma/client';

export class CompetitionPrisma implements competition {
  id: bigint;
  name: string;
  start_date: Date;
  end_date: Date;
}

export class CompetitionDTO {
  constructor(competition: CompetitionPrisma) {
    this.competition = competition;
  }

  competition: CompetitionPrisma;
}
