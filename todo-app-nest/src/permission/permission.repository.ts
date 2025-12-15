import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/Permission.schema';
import { Model } from 'mongoose';

@Injectable()
export class PermissionRepository {

    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>
    ) { }

    findAll(): Promise<PermissionDocument[]> {
        return this.permissionModel.find().exec();
    }

    findBySlug(slug: string): Promise<PermissionDocument | null> {
        return this.permissionModel.findOne({ slug }).exec();
    }

    findBySlugs(slugs: string[]): Promise<PermissionDocument[]> {
        return this.permissionModel.find({ slug: { $in: slugs } }).exec();
    }

    // createMany(permissions: Partial<PermissionDocument>[]): Promise<PermissionDocument[]> {
    //     return this.permissionModel.insertMany(permissions);
    // }

}