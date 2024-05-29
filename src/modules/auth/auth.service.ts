import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dtos/createUser.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { createHash, randomBytes } from 'crypto';
import { Token } from './entities/token.entity';
import { TokenType } from 'src/enums/index.enum';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { log } from 'console';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async createToken(user: User): Promise<String> {
    return await this.jwtService.signAsync(
      {
        userId: user.id,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE,
      },
    );
  }

  async checkTokenExisting(userId: number, type: TokenType) {
    const checkExistingToken = await this.tokenRepository.findOne({ where: { userId: userId, type: type }});
    if (!checkExistingToken) {
      throw new UnauthorizedException();
    }
    return checkExistingToken;
  }
  async createRefreshToken(user: User): Promise<String> {
    const userId = user.id;
    const checkExistingToken = this.checkTokenExisting(userId, TokenType.REFRESH);
    if (checkExistingToken) {
      await this.tokenRepository.delete({ userId: userId, type: TokenType.REFRESH });
    }
    const rfToken =  await this.jwtService.signAsync(
      {
        userId: userId,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
      },
    );
    const expiresInMilliseconds = +process.env.REFRESH_TOKEN_EXPIRE.slice(0, -1) * 86400000;
    await this.tokenRepository.save({
      userId: user.id,
      token: rfToken,
      type: TokenType.REFRESH,
      expiredAt: new Date(Date.now() + expiresInMilliseconds),
    })

    return rfToken;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: username,
      },
    });

    if (!user) {
      this.logger.debug(`${username} not found`);
      throw new UnauthorizedException('Email or password is not correct');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user ${username}`);
      throw new UnauthorizedException('Email or password is not correct');
    }

    return user;
  }

  async register(data: CreateUserDto): Promise<User | undefined> {
    if (data.password !== data.passwordConfirm) {
      throw new UnauthorizedException(
        'Password and confirm password do not match',
      );
    }
    const email = data.email;
    const isEmailExisted = await this.userRepository.findOne({ where: { email } });
    if (isEmailExisted) {
      throw new UnauthorizedException('Email is already existed');
    }
    const user = new User({
      ...data,
      password: await this.hashPassword(data.password),
    });

    return await this.userRepository.save(user);
  }

  async updatePassword( user: User, data: UpdatePasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = data;
    console.log(oldPassword);
    console.log(user);
    
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException('Old password is not correct');
    }

    if (newPassword !== confirmPassword) {
      throw new UnauthorizedException(
        'New password and confirm password do not match',
      );
    }

    user.password = await this.hashPassword(newPassword);
    return await this.userRepository.save(user);
  }

  async sendResetPasswordEmail(input: ForgotPasswordDto) {
    const { email } = input;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email is not correct');
    }
    const token = randomBytes(32).toString('hex');
    const savedToken = new Token();
    savedToken.type = TokenType.FORGOT_PASSWORD;
    savedToken.token = createHash('sha256').update(token).digest('hex');
    savedToken.expiredAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.tokenRepository.save(savedToken);

    await this.mailService.sendResetPasswordEmail(email, token);
  }



  async getUserProfile(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async resetPassword(data: ResetPasswordDto) {
    const { token, password, confirmPassword } = data;
    const savedToken = await this.tokenRepository.findOne({
      where: {
        token: createHash('sha256').update(token).digest('hex'),
        type: TokenType.FORGOT_PASSWORD,
      },
    });

    if (!savedToken) {
      throw new UnauthorizedException('Token is not correct');
    }

    if (new Date() > savedToken.expiredAt) {
      throw new UnauthorizedException('Token is expired');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: savedToken.userId,
      },
    });

    user.password = await this.hashPassword(password);
    await this.userRepository.save(user);
  }
}
