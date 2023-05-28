import { Injectable, HttpException } from '@nestjs/common';
import { CreatePlayerDto, SearchPlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from '../../database/prisma';
import { unlinkSync, readFileSync } from 'fs';
import { subYears, subDays } from 'date-fns';
import { S3 } from 'aws-sdk';

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

  async updateImage(id: number, file: Express.Multer.File) {
    const player = await this.prisma.player.findUnique({
      where: {
        id,
      },
    });

    if (!player) {
      deleteLocalFile();
      throw new HttpException('Jogador não localizado.', 400);
    }

    const s3 = new S3({
      endpoint: process.env.DO_SPACES_ENDPOINT,
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    });
    uploadFileToBucket();
    deleteLocalFile(true);

    const updatedUser = await this.prisma.player.update({
      where: {
        id,
      },
      data: {
        photo: file.filename,
        updated_at: new Date(),
      },
    });

    return updatedUser;

    function deleteLocalFile(deleteBucket = false) {
      unlinkSync(`src/../upload/${file.filename}`);

      if (deleteBucket) {
        s3.deleteObject(
          {
            Bucket: process.env.DO_SPACES_NAME,
            Key: player.photo,
          },
          () => {
            // console.log()
          },
        );
      }
    }

    function uploadFileToBucket() {
      s3.putObject(
        {
          Bucket: process.env.DO_SPACES_NAME,
          Key: file.filename,
          Body: readFileSync(file.path),
          ACL: 'public-read',
        },
        (err) => {
          if (err) return console.log(err);
        },
      );
    }
  }

  async search(searchPlayerDto: SearchPlayerDto) {
    const dataAtual = new Date();
    const filterDate = [
      {
        birth_date: {
          gte: subYears(dataAtual, 200),
          lte: subYears(dataAtual, 1),
        },
      },
    ];

    if (searchPlayerDto.categories) {
      filterDate.length = 0;
      const categories = await this.prisma.category.findMany({
        where: {
          id: {
            in: [...searchPlayerDto.categories],
          },
        },
      });

      categories.forEach((category) => {
        const dataInicial = subYears(dataAtual, category.max_age + 1);
        const dataFinal = subDays(subYears(dataAtual, category.min_age), 1);

        filterDate.push({
          birth_date: {
            gte: dataInicial,
            lte: dataFinal,
          },
        });
      });
    }

    const players = await this.prisma.player.findMany({
      where: {
        team_id: { not: searchPlayerDto.team_id },
        name: {
          contains: searchPlayerDto.name,
          mode: 'insensitive',
        },
        OR: filterDate,
      },
    });

    return players;
  }
}
