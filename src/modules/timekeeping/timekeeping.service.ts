import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeKeeping } from './entities/timekeeping.entity';
import { CreateCheckTimeDto } from './dtos/createCheckTime.dto';
import { Between, Repository } from 'typeorm';
import { UpdateCheckTimeDto } from './dtos/updateCheckTime.dto';

@Injectable()
export class TimeKeepingService {
  constructor(
    @InjectRepository(TimeKeeping)
    private readonly timeKeepingRepository: Repository<TimeKeeping>,
  ) {}

  async getAllTimeKeeping() {
    return await this.timeKeepingRepository.find();
  }

  async getOneTimeKeeping(id: number) {
    return await this.timeKeepingRepository.findOne({
      where: { id },
    });
  }

  async createTimeKeeping(data: CreateCheckTimeDto) {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const checkedToday = await this.timeKeepingRepository.findOne({
      where: {
        userId: data.userId,
        createdAt: Between(startDate, endDate),
      },
    });

    if (!checkedToday) {
      let result: TimeKeeping;
      result.checkDay = data.checkTime.toISOString().split('T')[0];
      result.checkIn = data.checkTime;
      result.userId = data.userId;

      return this.timeKeepingRepository.save(result);
    } else {
      const totalHours =
        (data.checkTime.getTime() - checkedToday.createdAt.getTime()) /
        1000 /
        60 /
        60;
      await this.timeKeepingRepository.update(
        { id: checkedToday.id },
        {
          checkOut: new Date(),
          totalHours: totalHours,
        },
      );
    }
  }

  async updateTimeKeeping(data: UpdateCheckTimeDto) {
    if (
      data?.checkIn &&
      data?.checkOut &&
      data.checkIn.getDay() !== data.checkOut.getDay()
    ) {
      // checkIn and checkOut are not from the same day
      return new BadRequestException(
        'Check in and check out must be in the same day',
      );
    }
    const existingRecord = await this.timeKeepingRepository.findOne({
      where: {
        userId: data.userId,
        checkDay:
          data.checkIn.toISOString().split('T')[0] ||
          data.checkOut.toISOString().split('T')[0],
      },
    });
    if (!existingRecord) {
      return new BadRequestException('Record not found');
    }

    let newRecord: TimeKeeping;

    newRecord.checkIn = data.checkIn || existingRecord.checkIn;
    newRecord.checkOut = data.checkOut || existingRecord.checkOut;
    newRecord.totalHours =
      (newRecord.checkOut.getTime() - newRecord.checkIn.getTime()) /
      1000 /
      60 /
      60;

    return this.timeKeepingRepository.save(newRecord);
  }

  async deleteOneTimekeeping(id: number) {
    return await this.timeKeepingRepository.softDelete({
      id,
    });
  }

  async deleteUserTimekeeping(userId: number) {
    return await this.timeKeepingRepository.softDelete({
      userId,
    });
  }
}
