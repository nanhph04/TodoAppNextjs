

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role, RoleDocument } from "./schema/Role.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class RoleRepository {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>
    ) { }

    async findByIds(roleIds: Types.ObjectId[]): Promise<RoleDocument[]> {
        return this.roleModel.find({ _id: { $in: roleIds } }).populate('permissions').exec();
    }

    async findByName(name: string): Promise<RoleDocument | null> {
        return this.roleModel.findOne({ name }).exec();
    }

    async findByPermissions(permissionIds: Types.ObjectId[]): Promise<RoleDocument[]> {
        return this.roleModel.find({ permissions: { $in: permissionIds } }).exec();
    }

    async create(roleData: Partial<RoleDocument>): Promise<RoleDocument> {
        const newRole = new this.roleModel(roleData);
        return newRole.save();
    }

    async findOne(filter: any): Promise<RoleDocument | null> {
        return this.roleModel.findOne(filter).exec();
    }


    async findAll(): Promise<RoleDocument[]> {
        return this.roleModel.find().exec();
    }

    async findById(id: string | Types.ObjectId): Promise<RoleDocument | null> {
        return this.roleModel.findById(id).exec();
    }

    async update(id: string | Types.ObjectId, update: Partial<RoleDocument>): Promise<RoleDocument | null> {
        return this.roleModel.findByIdAndUpdate(id, update, { new: true }).exec();
    }

    async delete(id: string | Types.ObjectId): Promise<RoleDocument | null> {
        return this.roleModel.findByIdAndDelete(id).exec();
    }


    async updateAndPopulatePermissions(roleId: string, permissions: Types.ObjectId[]): Promise<RoleDocument | null> {
        return this.roleModel.findByIdAndUpdate(
            roleId,
            { permissions },
            { new: true }
        ).populate('permissions').exec();
    }


}