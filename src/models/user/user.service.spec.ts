import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule, PrismaService, User } from '../../database/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const newUser: User = {
  id: BigInt(1),
  email: '',
  name: '',
  password: '',
  phone: '',
  created_at: new Date(),
  type: 'USER',
  updated_at: new Date(),
  username: 'guilhermelange',
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo entity item successfully', async () => {
      // Arrange
      const data: CreateUserDto = {
        email: '',
        name: '',
        password: '',
        phone: '',
        username: 'guilhermelange',
      };

      prisma.user.findFirst = jest.fn().mockResolvedValueOnce(undefined);
      prisma.user.create = jest.fn().mockResolvedValueOnce(newUser);

      // Act
      const result = await service.create(data);

      // Assert
      expect(result).toEqual(newUser);
      expect(result.password).toBeFalsy();
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(typeof result).toEqual('object');
    });

    it('should throw an exception', () => {
      // Arrange
      const data: CreateUserDto = {
        email: '',
        name: '',
        password: '',
        phone: '',
        username: 'guilhermelange',
      };

      prisma.user.findFirst = jest.fn().mockResolvedValueOnce(newUser);

      // Assert
      expect(service.create(data)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      // Arrange
      const data: UpdateUserDto = {
        email: 'gui.luizlange@gmail.com',
      };

      prisma.user.findUnique = jest.fn().mockResolvedValueOnce(newUser);
      prisma.user.update = jest.fn().mockResolvedValueOnce('');

      // Act
      const result = await service.update(1, data);

      // Assert
      expect(result).toEqual('');
      expect(prisma.user.update).toBeCalledTimes(1);
    });

    it('should throw a not found exception', () => {
      // Arrange
      prisma.user.findUnique = jest.fn().mockResolvedValueOnce(undefined);

      const data: UpdateUserDto = {
        email: 'gui.luizlange@gmail.com',
      };

      // Assert
      expect(service.update(1, data)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      // Arrange
      prisma.user.findUnique = jest.fn().mockResolvedValueOnce(newUser);
      prisma.user.delete = jest.fn().mockResolvedValue('');

      // Act
      const result = await service.remove(1);

      // Assert
      expect(result).toBeFalsy();
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception', async () => {
      // Arrange
      prisma.user.findUnique = jest.fn().mockResolvedValueOnce(undefined);

      // Assert
      expect(service.remove(1)).rejects.toThrowError();
      expect(prisma.user.findUnique).toBeCalledTimes(1);
    });
  });
});
