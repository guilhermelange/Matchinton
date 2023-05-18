import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../database/prisma';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const checkUserExists = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (checkUserExists) {
      throw new HttpException('Username não disponível.', 400);
    }

    const hashedPassword = await hash(password, 8);
    createUserDto.password = hashedPassword;

    const createdUser = await this.prisma.user.create({
      data: createUserDto,
    });

    createdUser.password = undefined;
    return createdUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('Usuário não localizado.', 400);
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        phone: updateUserDto.phone ? updateUserDto.phone : user.phone,
        name: updateUserDto.name ? updateUserDto.name : user.name,
        password: updateUserDto.password
          ? updateUserDto.password
          : user.password,
      },
    });

    return '';
  }

  async remove(id: number) {
    const user = this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('Usuário não localizado.', 400);
    }

    await this.prisma.user.delete({ where: { id } });
    return '';
  }
}
