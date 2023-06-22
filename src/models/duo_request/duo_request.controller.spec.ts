import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../database/prisma';
import { DuoRequestController } from './duo_request.controller';
import { DuoRequestService } from './duo_request.service';
import { CreateDuoRequestDto } from './dto/create-duo_request.dto';
import { UpdateDuoRequestDto } from './dto/update-duo_request.dto';
import { EmailService } from '../email/email.service';

describe('DuoRequestController', () => {
  let controller: DuoRequestController;
  let service: DuoRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [DuoRequestController],
      providers: [DuoRequestService, EmailService],
    }).compile();

    controller = module.get<DuoRequestController>(DuoRequestController);
    service = module.get<DuoRequestService>(DuoRequestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new duo request successfully', async () => {
      // Arrange
      const req: CreateDuoRequestDto = {
        player1: BigInt(1),
        player2: BigInt(2),
        competition: BigInt(1)
      };

      service.create = jest.fn().mockResolvedValueOnce(req);

      // Act
      const result = await controller.create(req);

      // Assert
      expect(result).toEqual(req);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(req);
    });

    it('should throw an exception', () => {
      // Arrange
      const req: CreateDuoRequestDto = {
        player1: BigInt(1),
        player2: BigInt(2),
        competition: BigInt(1)
      };

      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error());

      // Assert
      expect(controller.create(req)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update duo request successfully', async () => {
      // Arrange
      const req: CreateDuoRequestDto = {
        player1: BigInt(1),
        player2: BigInt(2),
        competition: BigInt(1)
      };

      service.update = jest.fn().mockResolvedValueOnce(req);

      const update: UpdateDuoRequestDto = {
        player: BigInt(1),
        status: 'CANCELED'
      }

      // Act
      const result = await controller.update(update, '1');

      // Assert
      expect(result).toEqual(req);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(update, 1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error());

      const update: UpdateDuoRequestDto = {
        player: BigInt(1),
        status: 'CANCELED'
      }

      // Assert
      expect(controller.update(update, '1')).rejects.toThrowError();
    });
  });

});
