import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.register(dto);
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return { accessToken: tokens.accessToken };
    }

    @Post('signin')
    async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(dto);
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return { accessToken: tokens.accessToken };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('logout')
    logout(@Req() req: Request) {
        const userId = req.user ? req.user['sub'] : undefined;
        if (!userId) {
            throw new Error('User not authenticated');
        }
        return this.authService.logout(userId);

    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Get('refresh')
    refreshTokens(@Req() req: Request) {
        if (!req.user || !req.user['sub'] || !req.user['refreshToken']) {
            throw new Error('User or refresh token not authenticated');
        }
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }


}
