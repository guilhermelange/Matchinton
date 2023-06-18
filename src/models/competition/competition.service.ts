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
      type: createCompetitionDto.type,
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
    const competition = (await this.prisma.competition.findMany({
      select: {
        id: true,
        name: true,
        start_date: true,
        end_date: true,
        type: true,
        competition_category: {
          select: {
            category: {
              select: {
                name: true,
                id: true,
                max_age: true,
                min_age: true,
              },
            },
          },
        },
      },
    })) as any;

    const convertedJson = competition.map((item) => {
      const newItem = { ...item };
      newItem.competition_category = item.competition_category.map(
        (category) => ({
          name: category.category.name,
          id: category.category.id,
          max_age: category.category.max_age,
          min_age: category.category.min_age,
        }),
      );
      return newItem;
    });

    return convertedJson;
  }

  async findOne(id: number) {
    const competition = (await this.prisma.competition.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        start_date: true,
        end_date: true,
        type: true,
        competition_category: {
          select: {
            category: {
              select: {
                name: true,
                id: true,
                max_age: true,
                min_age: true,
              },
            },
          },
        },
      },
    })) as any;

    if (!competition) {
      throw new HttpException('Competição não localizada.', 400);
    }

    const newItem = { ...competition };
    newItem.competition_category = competition.competition_category.map(
      (category) => ({
        name: category.category.name,
        id: category.category.id,
        max_age: category.category.max_age,
        min_age: category.category.min_age,
      }),
    );
    return newItem;
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
        type: updateCompetitionDto.type,
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
