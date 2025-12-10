import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.tdo';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.register(dto);
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, userId: tokens.email };
    }

    @Post('signin')
    async signin(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(dto);
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, userId: tokens.email };
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userId = (req.user as any)?.sub;
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return this.authService.logout(userId);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    refreshTokens(@Req() req: Request) {
        if (!req.user || !req.user['sub'] || !req.user['refreshToken']) {
            throw new Error('User or refresh token not authenticated');
        }
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @Post('google')
    async loginWithGoogle(@Body('token') token: string, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.verifyGoogleAndLogin(token);
        res.cookie('accessToken', result.accessToken, { httpOnly: true });
        res.cookie('refreshToken', result.refreshToken, { httpOnly: true });
        return result;
    }
}
