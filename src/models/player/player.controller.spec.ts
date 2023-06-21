import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PrismaModule } from '../../database/prisma';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [PlayerController],
      providers: [PlayerService],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new player successfully', async () => {
      // Arrange
      const player: CreatePlayerDto = {
        name: '',
        observation: '',
        birth_date: new Date(),
        city: '',
        state: '',
        team_id: BigInt(1),
        gender: 'MAS'
      };

      service.create = jest.fn().mockResolvedValueOnce(player);

      // Act
      const result = await controller.create(player);

      // Assert
      expect(result).toEqual(player);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(player);
    });

    it('should throw an exception', () => {
      // Arrange
      const player: CreatePlayerDto = {
        name: '',
        observation: '',
        birth_date: new Date(),
        city: '',
        state: '',
        team_id: BigInt(1),
        gender: 'MAS'
      };

      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(controller.create(player)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update player successfully', async () => {
      // Arrange
      const player: CreatePlayerDto = {
        name: '',
        observation: '',
        birth_date: new Date(),
        city: '',
        state: '',
        team_id: BigInt(1),
        gender: 'MAS'
      };

      service.update = jest.fn().mockResolvedValueOnce(player);

      const update: UpdatePlayerDto = {
        team_id: BigInt(1)
      }

      // Act
      const result = await controller.update('1', update);

      // Assert
      expect(result).toEqual(player);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, update);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error());

      const update: UpdatePlayerDto = {
        team_id: BigInt(1)
      }

      // Assert
      expect(controller.update('1', update)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should remove a player successfully', async () => {
      // Arrange
      service.remove = jest.fn().mockResolvedValueOnce('');

      // Act
      const result = await controller.remove('1');

      // Assert
      expect(result).toEqual('');
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error());

      // Assert
      expect(controller.remove('1')).rejects.toThrowError();
    });
  });

});
