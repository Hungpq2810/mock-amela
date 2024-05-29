import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Token } from './entities/token.entity';
import { MailService } from '../mail/mail.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { MailModule } from '../mail/mail.module';
import { UserService } from '../users/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), JwtModule.register({}), MailModule],
  controllers: [AuthController],
  providers: [AuthService, MailService, LocalStrategy, JwtStrategy, RefreshTokenStrategy, UserService],
})
export class AuthModule {}
