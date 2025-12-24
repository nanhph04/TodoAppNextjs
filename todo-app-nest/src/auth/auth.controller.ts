import { Controller, Post, Body, UseGuards, Req, Get, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.tdo';
import { LoginDto } from './dto/login.dto';
import { requireUserId } from 'src/auth/context/request-context';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.register(dto);
        const cookieOptions = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' };
        res.cookie('accessToken', tokens.accessToken, cookieOptions);
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, mail: tokens.email };
    }

    @Post('signin')
    async signin(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(dto);
        const cookieOptions = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' };
        res.cookie('accessToken', tokens.accessToken, cookieOptions);
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, mail: tokens.email };
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { userId } = requireUserId(req);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return this.authService.logout(userId);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    refreshTokens(@Req() req: Request) {
        const sub = (req.user as any)?.sub;
        const refreshToken = (req.user as any)?.refreshToken;
        if (!sub || !refreshToken) {
            throw new UnauthorizedException('User or refresh token not authenticated');
        }
        return this.authService.refreshTokens(sub, refreshToken);
    }

    @Post('google')
    async loginWithGoogle(@Body('token') token: string, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.verifyGoogleAndLogin(token);
        const cookieOptions = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' };
        res.cookie('accessToken', result.accessToken, cookieOptions);
        res.cookie('refreshToken', result.refreshToken, cookieOptions);
        return result;
    }
}
