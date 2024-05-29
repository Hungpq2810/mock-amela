import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dtos/createDepartment.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async getAllDepartments() {
    return await this.departmentRepository.find();
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
    return await this.departmentRepository.save(data);
  }

  async updateDepartment(id: number, data: CreateDepartmentDto) {
    return await this.departmentRepository.update(id, data);
  }

  async deleteDepartment(id: number) {
    return await this.departmentRepository.softDelete(id);
  }
}
