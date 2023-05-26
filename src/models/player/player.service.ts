import { Injectable, HttpException } from '@nestjs/common';
import { CreatePlayerDto, SearchPlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from '../../database/prisma';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlayerDto: CreatePlayerDto) {
    const player = await this.prisma.player.findFirst({
      where: {
        name: createPlayerDto.name,
        team_id: createPlayerDto.team_id,
      },
    });

    if (player) {
      throw new HttpException('Este jogador já existe.', 400);
    }

    const newPlayer = await this.prisma.player.create({
      data: {
        birth_date: new Date(createPlayerDto.birth_date),
        city: createPlayerDto.city,
        name: createPlayerDto.name,
        observation: createPlayerDto.observation,
        photo: createPlayerDto.photo || '',
        state: createPlayerDto.state,
        team_id: createPlayerDto.team_id,
      },
    });

    return newPlayer;
  }

  async findAll(team_id: number) {
    return this.prisma.player.findMany({
      where: {
        team_id: team_id,
      },
    });
  }

  async findOne(id: number) {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    });

    if (!player) {
      throw new HttpException('Jogador não localizado.', 400);
    }

    return player;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    });

    if (!player) {
      throw new HttpException('Jogador não localizada.', 400);
    }

    const updatedPlayer = await this.prisma.player.update({
      where: {
        id,
      },
      data: updatePlayerDto,
    });

    return updatedPlayer;
  }

  async remove(id: number) {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    });

    if (!player) {
      throw new HttpException('Jogador não localizado.', 400);
    }

    await this.prisma.player.delete({
      where: {
        id,
      },
    });

    return '';
  }

  async search(searchPlayerDto: SearchPlayerDto) {
    const players = await this.prisma.player.findMany({
      where: {
        team_id: { not: searchPlayerDto.team_id },
        name: {
          contains: searchPlayerDto.name,
          mode: 'insensitive',
        },
      },
    });
    return players;
  }
}
