import { Injectable } from '@nestjs/common';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateScheduleDto } from './dtos/createSchedule.dto';
import { CronJob } from 'cron';
import { Notification } from '../notification/entities/notification.entity';
import { UpdateScheduleDto } from './dtos/updateSchedule.dto';

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly dataSource: DataSource

    ) {}

    async getAllSchedule() {
        return await this.scheduleRepository.find({
            relations: ['sender','receiver']
        });
    }
    
    public async getScheduleById(id: number) {
        return await this.scheduleRepository.findOne({
            where: { id },
            relations: ['sender','receiver']
        });
    }

    async createSchedule(data: CreateScheduleDto, userId: number) {
        return this.dataSource.manager.transaction(async (manager) => {
            const newSchedule = await manager.getRepository(Schedule).save({
                senderId: userId,
                receiverId: data.receiverId,
                title: data.title,
                content: data.content,
                sendDate: new Date(data.sendDate),
            });

            const job = new CronJob(new Date(data.sendDate), async () => {
                await this.dataSource.manager.getRepository(Notification).save({
                    scheduleId: newSchedule.id,
                });
            });

            this.schedulerRegistry.addCronJob(`${newSchedule.id}`, job);

            job.start();

            return {
                message: 'Ok'
            };
        })
    }

    async updateScheduleById (data: UpdateScheduleDto, id: number) {
        return await this.scheduleRepository.update(id, {
            ...data
        })
    }

    async deleteScheduleById(id: number) {
        this.schedulerRegistry.deleteCronJob(`${id}`);
        await this.scheduleRepository.softDelete(id);
    }

    async restartSavedCronTasks() {
        const schedules = await this.scheduleRepository.find({
            where: {
              sendDate: MoreThan(new Date()),
            },
          });
      
          return await Promise.all(
            schedules.map((schedule) => {
              return this.createSchedule(
                {
                  receiverId: schedule.receiverId,
                  title: schedule.title,
                  content: schedule.content,
                  sendDate: schedule.sendDate.toISOString(),
                },
                schedule.senderId,
              );
            }),
          );
    }

    async onModuleInit() {
        await this.restartSavedCronTasks();
    }
}
