import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule, PrismaService, competition, player } from '../../database/prisma';
import { DuoRequestService } from './duo_request.service';
import { CreateDuoRequestDto } from './dto/create-duo_request.dto';
import { UpdateDuoRequestDto } from './dto/update-duo_request.dto';
import { EmailService } from '../email/email.service';

describe('DuoRequestService', () => {
  let service: DuoRequestService;
  let prisma: PrismaService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [DuoRequestService, EmailService]
    }).compile();

    service = module.get<DuoRequestService>(DuoRequestService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it('should return a duo request created successfully', async () => {
      const req: CreateDuoRequestDto = {
        player1: BigInt(1),
        player2: BigInt(2),
        competition: BigInt(1)
      };

      const comp = {
        id: BigInt(1),
        type: 'MAS'
      };

      const play = {
        id: BigInt(1),
        gender: 'MAS'
      };

      prisma.competition.findFirst = jest.fn().mockResolvedValueOnce(comp as competition);
      prisma.player.findFirst = jest.fn().mockResolvedValueOnce(play as player).mockResolvedValueOnce(play as player);
      prisma.duo_request.findFirst = jest.fn().mockResolvedValueOnce(undefined);
      prisma.duo_request.create = jest.fn().mockResolvedValueOnce(req);

      expect(await service.create(req)).toEqual(req);      
    });

    it('should throw an exception', () => {
      const req: CreateDuoRequestDto = {
        player1: BigInt(1),
        player2: BigInt(2),
        competition: BigInt(1)
      };

      prisma.duo_request.findFirst = jest.fn().mockResolvedValueOnce(req);

      expect(service.create(req)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return a duo request updated successfully', async () => {
      const req : CreateDuoRequestDto = {
        player1: BigInt(1),
        player2: BigInt(2),
        competition: BigInt(1)
      };

      prisma.duo_request.findFirst = jest.fn().mockResolvedValueOnce(req);
      prisma.duo_request.update = jest.fn().mockResolvedValueOnce(req);

      const update: UpdateDuoRequestDto = {
        player: BigInt(1),
        status: 'CANCELED'
      };

      expect(await service.update(update, 1)).toEqual(req);      
    });

    it('should throw an exception', () => {
      prisma.duo_request.findUnique = jest.fn().mockResolvedValueOnce(undefined);

      const update: UpdateDuoRequestDto = {
        player: BigInt(1),
        status: 'CANCELED'
      };

      expect(service.update(update, 1)).rejects.toThrowError();
    });
  });

});