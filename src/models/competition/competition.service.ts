import { Injectable, HttpException } from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { PrismaService } from '../../database/prisma';

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompetitionDto: CreateCompetitionDto) {
    const competition = await this.prisma.competition.findFirst({
      where: {
        name: createCompetitionDto.name,
      },
    });

    if (competition) {
      throw new HttpException('Competição indisponível.', 400);
    }

    const params = {
      end_date: new Date(createCompetitionDto.end_date),
      name: createCompetitionDto.name,
      start_date: new Date(createCompetitionDto.start_date),
      competition_category: {
        create: createCompetitionDto.categories.map((item) => {
          return { category_id: item };
        }),
      },
    };

    const newCompetition = await this.prisma.competition.create({
      data: params,
      include: {
        competition_category: true,
      },
    });
    return newCompetition;
  }

  async findAll() {
    return await this.prisma.competition.findMany();
  }

  async findOne(id: number) {
    const competition = await this.prisma.competition.findUnique({
      where: {
        id,
      },
    });

    if (!competition) {
      throw new HttpException('Competição não localizada.', 400);
    }

    return competition;
  }

  async update(id: number, updateCompetitionDto: UpdateCompetitionDto) {
    const competition = await this.prisma.competition.findUnique({
      where: {
        id,
      },
    });

    if (!competition) {
      throw new HttpException('Competição não localizada.', 400);
    }

    const updatedCompetition = await this.prisma.competition.update({
      where: {
        id,
      },
      data: {
        name: updateCompetitionDto.name,
        end_date: updateCompetitionDto.end_date,
        start_date: updateCompetitionDto.start_date,
      },
    });

    return updatedCompetition;
  }

  async remove(id: number) {
    const competition = await this.prisma.competition.findUnique({
      where: {
        id,
      },
    });

    if (!competition) {
      throw new HttpException('Competição não localizada.', 400);
    }

    await this.prisma.competition.delete({
      where: {
        id,
      },
    });

    return '';
  }
}
