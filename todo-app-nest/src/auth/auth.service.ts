import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schema/User.schema';
import { RegisterDto } from './dto/register.tdo';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        try {
            const newUser = await new this.userModel({
                fullName: dto.fullName,
                email: dto.email,
                password: hashedPassword,
            }).save();

            const tokens = await this.getTokens(newUser._id.toString(), newUser.email);
            await this.updateRtHash(newUser._id.toString(), tokens.refreshToken);
            return tokens;

        } catch (error) {
            throw new BadRequestException('Email already exists');
        }
    }

    async login(dto: LoginDto) {
        const user = await this.userModel.findOne({ email: dto.email });
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
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
        return true;
    }

    async refreshTokens(userId: string, rt: string) {
        const user = await this.userModel.findById(userId);
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
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: hash });
    }

    async getTokens(userId: string, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: 5 * 60 },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: 7 * 24 * 60 * 60 },
            ),
        ]);

        return {
            accessToken: at,
            refreshToken: rt,
            email: email
        };
    }



    async verifyGoogleAndLogin(token: string) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let ticket;
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
        let user = await this.userModel.findOne({ email: userFromGoogle.email });
        if (!user) {
            user = await new this.userModel({
                fullName: userFromGoogle.fullName,
                email: userFromGoogle.email,
                // password: 'google_oauth_no_password',
            }).save();
        }
        const tokens = await this.getTokens(user._id.toString(), user.email);
        await this.updateRtHash(user._id.toString(), tokens.refreshToken);
        return tokens;
    }
}