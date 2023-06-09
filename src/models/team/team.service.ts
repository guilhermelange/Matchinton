import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from '../../database/prisma';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    const userId = createTeamDto.userId;
    const team = await this.prisma.team.findFirst({
      where: {
        name: createTeamDto.name,
      },
    });

    if (team) {
      throw new BadRequestException('Time indisponível.');
    }

    const newTeam = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        user_id: userId,
      },
    });

    return newTeam;
  }

  async findAll(userId: number) {
    return this.prisma.team.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async findAllGlobal(name: string) {
    return this.prisma.team.findMany({
      where: {
        name: name,
      },
    });
  }

  async findOne(id: number) {
    const team = await this.prisma.team.findUnique({
      where: {
        id,
      },
    });

    if (!team) {
      throw new HttpException('Time não localizado.', 400);
    }

    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.prisma.team.findUnique({
      where: {
        id,
      },
    });

    if (!team) {
      throw new HttpException('Time não localizada.', 400);
    }

    const updatedCompetition = await this.prisma.team.update({
      where: {
        id,
      },
      data: updateTeamDto,
    });

    return updatedCompetition;
  }

  async remove(id: number) {
    const team = await this.prisma.team.findUnique({
      where: {
        id,
      },
    });

    if (!team) {
      throw new HttpException('Time não localizado.', 400);
    }

    await this.prisma.team.delete({
      where: {
        id,
      },
    });

    return '';
  }
}
