import { Module } from '@nestjs/common';
import { TimeKeepingController } from './timekeeping.controller';
import { TimeKeepingService } from './timekeeping.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeKeeping } from './entities/timekeeping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeKeeping])],
  controllers: [TimeKeepingController],
  providers: [TimeKeepingService],
})
export class TimeKeepingModule {}
