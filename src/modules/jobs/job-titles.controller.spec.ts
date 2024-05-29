import { Test, TestingModule } from '@nestjs/testing';
import { JobTitlesController } from './job.controller';

describe('JobTitlesController', () => {
  let controller: JobTitlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobTitlesController],
    }).compile();

    controller = module.get<JobTitlesController>(JobTitlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
