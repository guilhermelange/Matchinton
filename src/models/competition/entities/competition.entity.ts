import { category } from '@prisma/client';

export class CompetitionPrisma implements category {
  id: bigint;
  name: string;
  max_age: number;
}

export class CompetitionDTO {
  constructor(competition: CompetitionPrisma) {
    this.competition = competition;
  }

  competition: CompetitionPrisma;
}
