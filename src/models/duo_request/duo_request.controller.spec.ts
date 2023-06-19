import { Test, TestingModule } from '@nestjs/testing';
import { DuoRequestController } from './duo_request.controller';
import { DuoRequestService } from './duo_request.service';

describe('DuoRequestController', () => {
  let controller: DuoRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DuoRequestController],
      providers: [DuoRequestService],
    }).compile();

    controller = module.get<DuoRequestController>(DuoRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
