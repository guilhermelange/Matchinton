export class CreatePlayerDto {
  name: string;
  observation: string;
  birth_date: Date;
  photo?: string;
  city: string;
  state: string;
  team_id: bigint;
}

export class SearchPlayerDto {
  team_id: bigint;
  name?: string;
  categories?: number[];
}
