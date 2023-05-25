import { Injectable, HttpException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../database/prisma';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (category) {
      throw new HttpException('Categoria indisponível.', 400);
    }

    const newCategory = await this.prisma.category.create({
      data: createCategoryDto,
    });
    return newCategory;
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new HttpException('Categoria não localizada.', 400);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new HttpException('Categoria não localizada.', 400);
    }

    const updatedCategory = await this.prisma.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });

    return updatedCategory;
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new HttpException('Categoria não localizada.', 400);
    }

    await this.prisma.category.delete({
      where: {
        id,
      },
    });

    return '';
  }
}
