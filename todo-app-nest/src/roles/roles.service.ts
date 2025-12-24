import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { PermissionRepository } from 'src/permission/permission.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from 'src/user/user.repository';


@Injectable()
export class RolesService {
    constructor(
        private readonly roleRepository: RoleRepository,
        private readonly permissionRepository: PermissionRepository,
        private readonly userRepository: UserRepository
    ) { }

    private toObjectIds(ids: string[]): Types.ObjectId[] {
        return ids.map(id => new Types.ObjectId(id));
    }

    async create(dto: CreateRoleDto) {
        const exists = await this.roleRepository.findOne({ name: dto.name });
        if (exists) throw new BadRequestException('Tên Role đã tồn tại');

        const ids = dto.permissionIds;
        const permissions = await this.permissionRepository.findBy({ _id: { $in: ids } });
        if (permissions.length !== ids.length) {
            throw new BadRequestException('Một số Permission ID không hợp lệ');
        }

        const objectIdPermissions = this.toObjectIds(ids);
        return this.roleRepository.create({
            name: dto.name,
            permissions: objectIdPermissions
        });
    }

    async findAllRoles() {
        return this.roleRepository.findAll();
    }

    async updatePermissions(roleId: string, permissionIds: string[]) {
        const permissions = await this.permissionRepository.findByIds(permissionIds);
        if (permissions.length !== permissionIds.length) {
            const foundIds = new Set(permissions.map((p: any) => p._id.toString()));
            const notFoundIds = permissionIds.filter(id => !foundIds.has(id.toString()));
            throw new BadRequestException({
                message: 'Một số Permission ID không hợp lệ',
                notFoundIds
            });
        }

        const objectIdPermissions = this.toObjectIds(permissionIds);
        const updatedRole = await this.roleRepository.updateAndPopulatePermissions(roleId, objectIdPermissions);
        if (!updatedRole) throw new NotFoundException('Role not found');
        return updatedRole;
    }

    async getRoleById(roleId: string) {
        const role = await this.roleRepository.findById(roleId);
        if (!role) throw new NotFoundException('Role not found');
        const permissions = await this.permissionRepository.findByIds(
            role.permissions.map(p => p.toString())
        );
        const permissionSlugs = permissions.map(p => p.slug);
        return {
            _id: role._id,
            name: role.name,
            permissionSlugs,
        };
    }

    getUsersByRole(roleId: string) {
        return this.userRepository.findByRole(new Types.ObjectId(roleId));

    }
}
