import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './createJob.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
