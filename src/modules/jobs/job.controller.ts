import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from '../auth/guards/authGuard.jwt';
import { JobService } from './job.service';
import { CreateJobDto } from './dtos/createJob.dto';
import { Role } from 'src/enums/index.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateJobDto } from './dtos/updateJob.dto';

@Controller('job')
@ApiTags('job')
@ApiBearerAuth('token')
@UseGuards(AuthGuardJwt)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  public async getAllJobs() {
    return await this.jobService.getAllJobs();
  }

  @Get('/:id')
  public async getJobById(@Param('id') id: number) {
    return await this.jobService.getJobById(id);
  }

  @Get('/:id/users')
  public async getUsersByJobId(@Param('id') id: number) {
    return await this.jobService.getUsersByJobId(id);
  }

  @Post()
  @ApiBody({ type: CreateJobDto })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'For admin',
  })
  public async createJob(@Body() data: CreateJobDto) {
    return await this.jobService.createJob(data);
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateJobDto })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'For admin',
  })
  public async updateJob(@Param('id') id: number, @Body() data: CreateJobDto) {
    return await this.jobService.updateJob(id, data);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'For admin',
  })
  public async deleteJob(@Param('id') id: number) {
    return await this.jobService.deleteJob(id);
  }
}
