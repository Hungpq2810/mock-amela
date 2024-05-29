import { Test, TestingModule } from '@nestjs/testing';
import { TimeKeepingService } from './timekeeping.service';

describe('TimeKeepingService', () => {
  let service: TimeKeepingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeKeepingService],
    }).compile();

    service = module.get<TimeKeepingService>(TimeKeepingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
