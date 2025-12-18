import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { PermissionRepository } from 'src/permission/permission.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { Types } from 'mongoose';


@Injectable()
export class RolesService {
    constructor(
        private readonly roleRepository: RoleRepository,
        private readonly permissionRepository: PermissionRepository,
    ) { }

    async create(dto: CreateRoleDto) {
        // Check tên role trùng
        const exists = await this.roleRepository.findOne({ name: dto.name });
        if (exists) throw new BadRequestException('Tên Role đã tồn tại');

        // Đảm bảo chỉ truyền mảng id, không truyền object
        const ids = dto.permissionIds.map(p => typeof p === 'string' ? p : p._id);
        // Validate Permission IDs có thật trong DB không
        const permissions = await this.permissionRepository.findBy({ _id: { $in: ids } });
        if (permissions.length !== ids.length) {
            throw new BadRequestException('Một số Permission ID không hợp lệ');
        }

        return this.roleRepository.create({
            name: dto.name,
            permissions: ids
        });
    }

    async findAllRoles() {
        return this.roleRepository.findAll();
    }

    async findRoleById(roleId: string) {
        return this.roleRepository.findById(roleId);
    }

    async updatePermissions(roleId: string, permissionIds: (string | { _id: string })[]) {
        const ids = permissionIds.map(p =>
            typeof p === 'string' ? p : (typeof p === 'object' && '_id' in p ? p._id : '')
        ).filter(Boolean);
        const permissions = await this.permissionRepository.findByIds(ids);
        if (permissions.length !== ids.length) {
            throw new BadRequestException('Một số Permission ID không hợp lệ');
        }

        const objectIdPermissions = ids.map(id => new Types.ObjectId(id));
        const updatedRole = await this.roleRepository.updateAndPopulatePermissions(roleId, objectIdPermissions);
        if (!updatedRole) throw new NotFoundException('Role not found');
        return updatedRole;
    }

    async findAllWithPopulate() {
        const roles = await this.roleRepository.findAll();
        return roles;
    }
}
