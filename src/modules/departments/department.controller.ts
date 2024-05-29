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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dtos/createDepartment.dto';
import { Role } from 'src/enums/index.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('department')
@ApiTags('department')
@ApiBearerAuth('token')
@UseGuards(AuthGuardJwt)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  public async getAllDepartments() {
    return await this.departmentService.getAllDepartments();
  }

  @Get(':id')
  public async getDepartment(@Param('id') id: number) {
    return await this.departmentService.getDepartmentById(id);
  }

  @Get('/:id/users')
    public async getDepartmentUsers(@Param('id') id: number) {
        return await this.departmentService.getEmployeesByDepartment(id);
    }

  @Post()
  @ApiOperation({
    summary: 'For admin',
  })
  @ApiBody({ type: CreateDepartmentDto })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  public async createDepartment(input: CreateDepartmentDto) {
    return await this.departmentService.createDepartment(input);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'For admin',
  })
  @ApiBody({ type: CreateDepartmentDto })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  public async updateDepartment(
    @Param('id') id: number,
    @Body() data: CreateDepartmentDto,
  ) {
    return await this.departmentService.updateDepartment(id, data);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'For admin',
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  public async deleteDepartment(@Param('id') id: number) {
    return await this.departmentService.deleteDepartment(id);
  }
}
