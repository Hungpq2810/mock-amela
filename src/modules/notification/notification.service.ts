import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dtos/createNotification.dto';
import { UpdateNotificationDto } from './dtos/updateNotification.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>
    ) {}

    async getAllNotifications() {
        return await this.notificationRepository.find({
            relations: ['schedule'],
        });
    }

    async getNotificationById(id: number) {
        return await this.notificationRepository.findOne({
            relations: ['schedule'],
            where: {
              id,
            },
          });
    }

    async getAllByReceiverId(receiverId: number) {
        return await this.notificationRepository.find({
            relations: ['schedule'],
            where: {
              schedule: {
                receiverId,
              },
            },
          });
    }

    async getAllBySenderId(senderId: number) {
        return await this.notificationRepository.find({
            relations: ['schedule'],
            where: {
              schedule: {
                senderId,
              },
            },
          });
    }

    async createNotification(data: CreateNotificationDto) {
        const notification = await this.notificationRepository.save(data);
        return notification;
    }

    async updateNotification(id: number, data: UpdateNotificationDto) {
        return await this.notificationRepository.update(id, data);
    }

    async deleteNotification(id: number) {
        return await this.notificationRepository.softDelete(id);
    }
}
