import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionRepository } from './permission.repository';


@Injectable()
export class PermissionsService {
    constructor(
        private readonly permissionRepository: PermissionRepository
    ) { }

    async create(dto: CreatePermissionDto) {
        // Check trùng
        const exists = await this.permissionRepository.findBySlug(dto.slug);
        if (exists) throw new BadRequestException('Permission slug đã tồn tại');

        return this.permissionRepository.create(dto);
    }

    async findAll() {
        return this.permissionRepository.findAll();
    }
}