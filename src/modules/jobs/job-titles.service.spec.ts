import { Test, TestingModule } from '@nestjs/testing';
import { JobTitlesService } from './job.service';

describe('JobTitlesService', () => {
  let service: JobTitlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobTitlesService],
    }).compile();

    service = module.get<JobTitlesService>(JobTitlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
