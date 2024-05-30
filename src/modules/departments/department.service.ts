import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dtos/createDepartment.dto';
import { User } from '../users/entities/user.entity';
import { Role } from 'src/enums/index.enum';
import { UpdateDepartmentDto } from './dtos/updateDepartment.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllDepartments() {
    return await this.departmentRepository.find({
      where: {
        deletedAt: null,
      }
    });
  }

  async getDepartmentById(id: number) {
    return await this.departmentRepository.findOne({ where: { id } });
  }

  async getEmployeesByDepartment(id: number) {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    return department.users;
  }

  async createDepartment(data: CreateDepartmentDto) {
    const department = await this.departmentRepository.save(data);
    return department;
  }

  async updateDepartment(id: number, data: UpdateDepartmentDto) {
    return await this.departmentRepository.update(id, data);
}

  async deleteDepartment(id: number) {
    return await this.departmentRepository.softDelete(id);
  }
}
