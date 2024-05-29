import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './createDepartment.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
