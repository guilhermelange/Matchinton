import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { PrismaService } from '../../database/prisma';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createAuthenticationDto: CreateAuthenticationDto) {
    const { username, password } = createAuthenticationDto;

    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Dados inválidos!');
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('Dados inválidos!');
    }

    const payload = {
      username: user.name,
      sub: { id: user.id, role: user.type },
    };
    const token = this.jwtService.sign(payload);

    user.password = undefined;

    return {
      user,
      token,
    };
  }
}
