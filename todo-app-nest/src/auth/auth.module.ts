import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/User.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [AccessTokenStrategy, RefreshTokenStrategy, AuthService, GoogleStrategy],
})
export class AuthModule { }
