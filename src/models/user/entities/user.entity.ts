import { User, UserType } from 'src/database/prisma';

export class UserPrisma implements User {
  name: string;
  username: string;
  password: string;
  phone: string;
  type: UserType;
  created_at: Date;
  updated_at: Date;
  id: bigint;
}

export class UserDTO {
  constructor(user: UserPrisma) {
    this.user = user;
  }

  user: UserPrisma;
}
