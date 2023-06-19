import { Test, TestingModule } from '@nestjs/testing';
import { DuoRequestService } from './duo_request.service';

describe('DuoRequestService', () => {
  let service: DuoRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DuoRequestService],
    }).compile();

    service = module.get<DuoRequestService>(DuoRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
