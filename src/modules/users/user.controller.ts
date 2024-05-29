import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from '../auth/guards/authGuard.jwt';
import { UserService } from './user.service';
import { Role } from 'src/enums/index.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuardJwt)
@ApiBearerAuth('token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'For admin',
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  public async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('/profile')
  @ApiOperation({
    summary: 'For all user',
  })
  public async getMyProfile(@CurrentUser() user: User) {
    return await this.userService.getProfile(user);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'For admin',
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  public async getUserById(@Param('id') id: number) {
    return await this.userService.getUserById(id);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'For admin',
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  public async deleteUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
