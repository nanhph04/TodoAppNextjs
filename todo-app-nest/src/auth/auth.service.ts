import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RegisterDto } from './dto/register.tdo';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from 'src/user/user.repository';
import { RoleRepository } from 'src/roles/role.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private jwtService: JwtService,
    ) { }

    // auth.service.ts
    async register(dto: RegisterDto) {
        // 1. Check Email
        const userExists = await this.userRepository.findByEmail(dto.email);
        if (userExists) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const userRole = await this.roleRepository.findByName('User');
        if (!userRole) {
            throw new BadRequestException('System Error: Default role "User" not found');
        }

        const newUser = await this.userRepository.create({
            fullName: dto.fullName,
            email: dto.email,
            password: hashedPassword,
            roles: [userRole._id], // TypeScript đã hiểu _id nhờ RoleDocument
        });

        // 5. Token logic
        const tokens = await this.getTokens(newUser._id.toString(), newUser.email);
        await this.updateRtHash(newUser._id.toString(), tokens.refreshToken);

        return tokens;
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
        const role = user?.roles || [];
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId },
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
        let generatedPassword = "abcdefghij"; // Default password in case email sending fails
        let isNewUser = false;
        if (!user) {
            // Generate a random password
            generatedPassword = Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            // Get default role (role.name = 'User')
            const userRole = await this.roleRepository.findByName('User');
            if (!userRole) {
                throw new BadRequestException('Default role not found');
            }
            const roleId = userRole._id;
            user = await this.userRepository.create({
                fullName: userFromGoogle.fullName,
                email: userFromGoogle.email,
                password: hashedPassword,
                roles: [roleId],
            });
            isNewUser = true;
        }
        const tokens = await this.getTokens(user._id.toString(), user.email);
        await this.updateRtHash(user._id.toString(), tokens.refreshToken);

        // Send password to email if user is new
        if (isNewUser && generatedPassword) {
            // Lazy import nodemailer
            const nodemailer = await import('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                },
            });
            await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: user.email,
                subject: 'Your Todo App Password',
                text: `Welcome to Todo App! Your generated password is: ${generatedPassword}`,
            });
        }
        return tokens;
    }
}