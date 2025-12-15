import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schema/Permission.schema';
import { PermissionRepository } from './permission.repository';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionRepository],
})
export class PermissionModule { }
