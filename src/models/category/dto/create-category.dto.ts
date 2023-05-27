import { category } from '@prisma/client';

export class CreateCategoryDto implements category {
  id: bigint;
  name: string;
  max_age: number;
  min_age: number;
}
