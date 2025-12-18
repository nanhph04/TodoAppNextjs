import { PermissionModule } from 'src/permission/permission.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schema/User.schema';
import { UserRepository } from './user.repository';
import { RoleSchema } from 'src/roles/schema/Role.schema';
import { PermissionSchema } from 'src/permission/schema/Permission.schema';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsGuard } from 'src/auth/permissions.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Role', schema: RoleSchema },
      { name: 'Permission', schema: PermissionSchema },
    ]),
    RolesModule,
    PermissionModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, PermissionsGuard],
  exports: [UserService, UserRepository],
})
export class UserModule { }
