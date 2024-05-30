import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from '../auth/guards/authGuard.jwt';
import { NotificationService } from './notification.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/index.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateNotificationDto } from './dtos/createNotification.dto';
import { UpdateNotificationDto } from './dtos/updateNotification.dto';

@Controller('notification')
@ApiTags('notification')
@ApiBearerAuth('token')
@UseGuards(AuthGuardJwt)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    @ApiOperation({
        summary: 'For admin'
    })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    public async getAllNotifications() {
        return await this.notificationService.getAllNotifications();
    }

    @Get('/myNotifications')
    async getNotificationsByReceiverId(@CurrentUser() user) {
        return await this.notificationService.getAllByReceiverId(user.id);
    }

    @Get('/sentNotifications')
    async getNotificationsBySenderId(@CurrentUser() user) {
        return await this.notificationService.getAllBySenderId(user.id);
    }

    @Get('/:id')
    async getNotificationById(@Param('id') id: number) {
        return await this.notificationService.getNotificationById(id);
    }

    @Post()
    @ApiOperation({
        summary: 'For admin'
    })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    public async createNotification(@Body() data: CreateNotificationDto) {
        return await this.notificationService.createNotification(data);
    }

    @Patch('/:id')
    @ApiOperation({
        summary: 'For admin'
    })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    public async updateNotification(@Param('id') id: number, @Body() data: UpdateNotificationDto) {
        return await this.notificationService.updateNotification(id, data);
    }
}
