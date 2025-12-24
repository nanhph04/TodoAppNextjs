import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/Permission.schema';
import { Model } from 'mongoose';

@Injectable()
export class PermissionRepository {

    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>
    ) { }

    create(permission: Partial<PermissionDocument>): Promise<PermissionDocument> {
        const newPermission = new this.permissionModel(permission);
        return newPermission.save();
    }

    findAll(): Promise<PermissionDocument[]> {
        return this.permissionModel.find().exec();
    }

    findBySlug(slug: string): Promise<PermissionDocument | null> {
        return this.permissionModel.findOne({ slug }).exec();
    }

    findBySlugs(slugs: string[]): Promise<PermissionDocument[]> {
        return this.permissionModel.find({ slug: { $in: slugs } }).exec();
    }

    findByIds(ids: string[]): Promise<PermissionDocument[]> {
        return this.permissionModel.find({ _id: { $in: ids } }).exec();
    }

    findBy(filter: any): Promise<PermissionDocument[]> {
        return this.permissionModel.find(filter).exec();
    }

}