import { Body, Controller, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { LoginDto } from './dtos/login.dto';
import { AuthGuardLocal } from './guards/authGuard.local';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import { AuthGuardJwt } from './guards/authGuard.jwt';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { CreateUserDto } from '../users/dtos/createUser.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/login')
    @UseGuards(AuthGuardLocal)
    @ApiBody({
        type: LoginDto,
    })
    async login(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) res: Response,
    ) {
        const [accessToken, refreshToken] = await Promise.all([
            this.authService.createToken(user),
            this.authService.createRefreshToken(user),
        ]);
        res.cookie('access-token', accessToken, { httpOnly: true });
        res.cookie('refresh-token', refreshToken, { httpOnly: true });
        return {
            accessToken,
            refreshToken,
            user: user,
        };
    }

    @Post('/register')
    @ApiBody({ type: CreateUserDto })
    public async register(@Body() data: CreateUserDto) {
        return await this.authService.register(data)
    }

    @Post('/logout')
    @UseGuards(AuthGuardJwt)
    @ApiBearerAuth('token')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access-token');
        res.clearCookie('refresh-token');
        return {
            message: 'Logged out successfully',
        };
    }

    @Post('/updatePassword')
    @UseGuards(AuthGuardJwt)
    @ApiBearerAuth('token')
    @ApiBody({ type: UpdatePasswordDto })
    async updatePassword(
        @CurrentUser() user: User,
        @Body() data: UpdatePasswordDto,
    ) {
        return await this.authService.updatePassword(user, data);
    }

    @Post('/forgotPassword')
    @ApiBody({ type: ForgotPasswordDto })
    async forgotPassword(@Body() data: ForgotPasswordDto) {
        return await this.authService.sendResetPasswordEmail(data);
    }

    @Patch('/resetPassword')
    @ApiBody({ type: UpdatePasswordDto })
    async resetPassword(
        data: ResetPasswordDto
    ) {
        return await this.authService.resetPassword(data);
    }
}
