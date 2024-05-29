import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dtos/createJob.dto';
import { UpdateJobDto } from './dtos/updateJob.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async getAllJobs(): Promise<Job[]> {
    try {
      return await this.jobRepository.find();
    } catch (error) {
      throw new Error('Error fetching jobs');
    }
  }

  async getJobById(id: number): Promise<Job> {
    try {
      return await this.jobRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Job not found');
    }
  }

  async createJob(data: CreateJobDto) {
    try {
      return await this.jobRepository.save(data);
    } catch (error) {
      throw new Error('Error creating job');
    }
  }

  async updateJob(id: number, data: UpdateJobDto) {
    try {
      await this.jobRepository.update(id, data);
      return await this.jobRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Error updating job');
    }
  }

  async deleteJob(id: number) {
    try {
      const job = await this.jobRepository.findOne({ where: { id } });
      await this.jobRepository.softDelete(id);
      return job;
    } catch (error) {
      throw new Error('Error deleting job');
    }
  }

  async getUsersByJobId(id: number) {
    try {
      const job = await this.jobRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      return job.users;
    } catch (error) {
      throw new Error('Error fetching users');
    }
  }
}
