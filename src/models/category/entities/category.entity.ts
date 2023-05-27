import { category } from 'src/database/prisma';

export class CategoryPrisma implements category {
  id: bigint;
  name: string;
  max_age: number;
  min_age: number;
}

export class CategoryDTO {
  constructor(category: CategoryPrisma) {
    this.category = category;
  }

  category: CategoryPrisma;
}
