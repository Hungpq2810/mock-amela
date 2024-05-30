import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from '../auth/guards/authGuard.jwt';
import { TimeKeepingService } from './timekeeping.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/index.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateCheckTimeDto } from './dtos/createCheckTime.dto';
import { UpdateCheckTimeDto } from './dtos/updateCheckTime.dto';

@Controller('timekeeping')
@ApiTags('timekeeping')
@UseGuards(AuthGuardJwt)
@ApiBearerAuth('token')
export class TimeKeepingController {
    constructor(private readonly timeKeepingService: TimeKeepingService) {
    }

    @Get() 
    @ApiOperation({
        summary: 'For admin'
    })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    public async getAllTimeKeeping() {
        return await this.timeKeepingService.getAllTimeKeeping();
    }

    @Get('/user')
    @ApiOperation({
        summary: 'For user'
    })
    public async getTimeKeepingByUser(@CurrentUser() user) {
        return await this.timeKeepingService.getTimeKeepingByUser(user.id);
    }

    @Get('/:id')
    @ApiOperation({
        summary: 'For admin'
    })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    public async getOneTimeKeeping(@Param('id') id: number) {
        return await this.timeKeepingService.getOneTimeKeeping(id);
    }

    @Post('/user')
    @ApiOperation({
        summary: 'For user'
    })
    public async createTimeKeeping(@Body() data: CreateCheckTimeDto) {
        return await this.timeKeepingService.createTimeKeeping(data);
    }

    @Patch('/:id')
    @ApiOperation({
        summary: 'For admin'
    })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    public async updateTimeKeeping(@Param('id') id: number, @Body() data: UpdateCheckTimeDto) {
        return await this.timeKeepingService.updateTimeKeeping(id, data);
    }

    @Delete('/:id')
    @ApiOperation({
        summary: 'For admin'
    })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    public async deleteTimeKeeping(@Param('id') id: number) {
        return await this.timeKeepingService.deleteOneTimekeeping(id);
    }
}
