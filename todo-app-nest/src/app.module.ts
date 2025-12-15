import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  controllers: [AppController],
  providers: [AppService, MailService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    UserModule,

    TodosModule,

    AuthModule,

    RolesModule,

    PermissionModule,

  ],
})
export class AppModule { }
