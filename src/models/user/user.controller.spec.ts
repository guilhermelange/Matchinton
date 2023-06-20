import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule, User } from '../../database/prisma';
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
  username: '',
};

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user and return without password', async () => {
      // Arrange
      const body: CreateUserDto = {
        email: '',
        name: '',
        password: '',
        phone: '',
        username: '',
      };
      jest.spyOn(service, 'create').mockResolvedValue(newUser);

      // Act
      const result = await controller.create(body);

      // Assert
      expect(result).toEqual(newUser);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(body);
      expect(result.password).toBeFalsy();
    });

    it('should throw an exception for bad request', () => {
      // Arrange
      const body = {
        email: '',
        name: '',
      };
      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(controller.create(body as CreateUserDto)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      // Arrange
      const body: UpdateUserDto = {
        email: 'gui.luizlange@gmail.com',
      };
      jest.spyOn(service, 'update').mockResolvedValue('');

      // Act
      const result = await controller.update('1', body);

      // Assert
      expect(result).toEqual('');
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, body);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: UpdateUserDto = {
        type: 'ADMIN',
      };

      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(controller.update('1', body)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should remove a user successfully', async () => {
      // Arrange
      jest.spyOn(service, 'remove').mockResolvedValue('');

      // Act
      const result = await controller.remove('1');

      // Assert
      expect(result).toBe('');
      expect(service.remove).toBeCalledTimes(1);
      expect(service.remove).toBeCalledWith(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error());

      // Assert
      expect(controller.remove('1')).rejects.toThrowError();
    });
  });
});
