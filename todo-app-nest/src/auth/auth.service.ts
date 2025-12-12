import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RegisterDto } from './dto/register.tdo';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const userExists = await this.userRepository.findByEmail(dto.email);
        if (userExists) {
            throw new BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        try {
            const newUser = await this.userRepository.create({
                fullName: dto.fullName,
                email: dto.email,
                password: hashedPassword,
                role: 'user',
            });
            const tokens = await this.getTokens(newUser._id.toString(), newUser.email);
            await this.updateRtHash(newUser._id.toString(), tokens.refreshToken);
            return tokens;

        } catch (error) {
            throw new BadRequestException('Email already exists');
        }
    }

    async login(dto: LoginDto) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new ForbiddenException('Access Denied');
        }

        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) {
            throw new ForbiddenException('Access Denied');
        }
        const tokens = await this.getTokens(user._id.toString(), user.email);
        await this.updateRtHash(user._id.toString(), tokens.refreshToken);
        return tokens;
    }

    async logout(userId: string) {
        await this.userRepository.update(userId, { refreshToken: null });
        return true;
    }

    async refreshTokens(userId: string, rt: string) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }
        const rtMatches = await bcrypt.compare(rt, user.refreshToken);
        if (!rtMatches) {
            throw new ForbiddenException('Access Denied');
        }
        const tokens = await this.getTokens(userId, user.email);
        await this.updateRtHash(userId, tokens.refreshToken);
        return tokens;
    }

    private async updateRtHash(userId: string, rt: string): Promise<void> {
        const hash = await bcrypt.hash(rt, 10);
        await this.userRepository.update(userId, { refreshToken: hash });
    }

    async getTokens(userId: string, email: string) {
        const user = await this.userRepository.findById(userId);
        const role = user?.role || [];
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email, role },
                { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: 5 * 60 },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: 1 * 24 * 60 * 60 },
            ),
        ]);

        return {
            accessToken: at,
            refreshToken: rt,
            email: email,
            role: role
        };
    }

    async verifyGoogleAndLogin(token: string) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let ticket: any;
        try {
            ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
        } catch (error) {
            throw new BadRequestException('Invalid token');
        }
        const payload = ticket.getPayload();
        if (!payload) {
            throw new BadRequestException('Invalid token payload');
        }
        const { name, email } = payload;
        const userFromGoogle = {
            fullName: name,
            email: email,

        };
        return this.loginWithGoogle(userFromGoogle);
    }

    async loginWithGoogle(userFromGoogle: any) {
        let user = await this.userRepository.findByEmail(userFromGoogle.email);
        if (!user) {
            user = await this.userRepository.create({
                fullName: userFromGoogle.fullName,
                email: userFromGoogle.email,
            });
        }
        const tokens = await this.getTokens(user._id.toString(), user.email);
        await this.updateRtHash(user._id.toString(), tokens.refreshToken);
        return tokens;
    }
}