import { Controller } from '@nestjs/common';
import { PermissionsService } from './permission.service';
import { Body, Post, Get, UseGuards } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';

// --- CONTROLLER ---
@Controller('permissions')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @Permissions('sys:perm:create') // Quyền admin cấp cao
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
  @Permissions('sys:perm:read')
  findAll() {
    return this.permissionsService.findAll();
  }
}
