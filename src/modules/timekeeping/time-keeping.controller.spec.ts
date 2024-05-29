import { Test, TestingModule } from '@nestjs/testing';
import { TimeKeepingController } from './timekeeping.controller';

describe('TimeKeepingController', () => {
  let controller: TimeKeepingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeKeepingController],
    }).compile();

    controller = module.get<TimeKeepingController>(TimeKeepingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
