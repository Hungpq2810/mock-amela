import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), NestScheduleModule.forRoot()],
  controllers: [ScheduleController],
  providers: [ScheduleService]
})
export class ScheduleModule {}
