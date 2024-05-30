import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        isActive: true,
      }
    });
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return await this.userRepository.update(id, data);
  }

  async getProfile(user: User) {
    return await this.userRepository.findOne({ where: { id: user.id } });
  }

  async deleteUser(id: number) {
    return await this.userRepository.softDelete(id);
  }
}
