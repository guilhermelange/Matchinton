import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { PrismaModule, PrismaService, UserGender, player } from '../../database/prisma';
import { PlayerController } from './player.controller';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

describe('PlayerService', () => {
  let service: PlayerService;
  let prisma: PrismaService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PlayerService]
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it('should return a player created successfully', async () => {
      const player: CreatePlayerDto = {
        name: '',
        observation: '',
        birth_date: new Date(),
        city: '',
        state: '',
        team_id: BigInt(1),
        gender: 'MAS'
      };

      prisma.player.create = jest.fn().mockResolvedValueOnce(player);

      expect(await service.create(player)).toEqual(player);      
    });

    it('should throw an exception', () => {
      const player: CreatePlayerDto = {
        name: '',
        observation: '',
        birth_date: new Date(),
        city: '',
        state: '',
        team_id: BigInt(1),
        gender: 'MAS'
      };

      prisma.player.findFirst = jest.fn().mockResolvedValueOnce(player);

      expect(service.create(player)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return a player updated successfully', async () => {
      const p: player = {
        id: BigInt(1),
        observation: '',
        name: '',
        birth_date: new Date(),
        photo: '',
        city: 'string',
        state: 'string',
        team_id: BigInt(1),
        gender: 'MAS',
        created_at: new Date(),
        updated_at: new Date()
      }

      prisma.player.findUnique = jest.fn().mockResolvedValueOnce(p);
      prisma.player.update = jest.fn().mockResolvedValueOnce(p);

      const update: UpdatePlayerDto = {
        team_id: BigInt(1)
      }

      expect(await service.update(1, update)).toEqual(p);      
    });

    it('should throw an exception', () => {
      prisma.player.findUnique = jest.fn().mockResolvedValueOnce(undefined);

      const update: UpdatePlayerDto = {
        team_id: BigInt(1)
      }

      expect(service.update(1, update)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should delete a player successfully', async () => {
      const p: player = {
        id: BigInt(1),
        observation: '',
        name: '',
        birth_date: new Date(),
        photo: '',
        city: 'string',
        state: 'string',
        team_id: BigInt(1),
        gender: 'MAS',
        created_at: new Date(),
        updated_at: new Date()
      }

      prisma.player.findUnique = jest.fn().mockResolvedValueOnce(p);
      prisma.player.delete = jest.fn().mockResolvedValueOnce('');

      expect(await service.remove(1)).toEqual('');
    });

    it('should throw an exception', () => {
      prisma.player.findUnique = jest.fn().mockResolvedValueOnce(undefined);

      expect(service.remove(1)).rejects.toThrowError();
    });
  });

});