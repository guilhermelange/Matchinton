export class CreateCompetitionDto {
  id: bigint;
  name: string;
  start_date: Date;
  end_date: Date;
  categories: number[];
}
