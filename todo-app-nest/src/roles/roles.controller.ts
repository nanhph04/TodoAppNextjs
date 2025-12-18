import { Controller } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Body, Post, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    // Tạo Role mới
    @Post()
    @Permissions('sys:role:create')
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.create(dto);
    }

    // Cập nhật quyền cho Role (Logic điều chỉnh permission)
    @Put(':id')
    @Permissions('sys:role:update')
    update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        const permissionIds = dto.permissionIds.map(id => id.toString());
        return this.rolesService.updatePermissions(id, permissionIds);
    }

    // API lấy danh sách Role để hiển thị bảng quản lý
    @Get()
    @Permissions('sys:read:any')
    findAll() {
        // Populate permissions để FE biết role này đang có quyền gì (tên, slug)
        return this.rolesService.findAllWithPopulate();
    }
}
