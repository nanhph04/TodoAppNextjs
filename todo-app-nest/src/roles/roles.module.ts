import { forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schema/Role.schema';
import { Permission, PermissionSchema } from '../permission/schema/Permission.schema';
import { PermissionModule } from '../permission/permission.module';
import { RoleRepository } from './role.repository';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
    PermissionModule,
    forwardRef(() => UserModule),
  ],
  providers: [RolesService, RoleRepository],
  controllers: [RolesController]
  , exports: [RoleRepository]
})
export class RolesModule { }
