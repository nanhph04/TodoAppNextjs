import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role, RoleDocument } from "./schema/Role.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class RoleRepository {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>
    ) { }

    findByIds(roleIds: Types.ObjectId[]): Promise<RoleDocument[]> {
        return this.roleModel.find({ _id: { $in: roleIds } }).populate('permissions').exec();
    }

    findByName(name: string): Promise<RoleDocument | null> {
        return this.roleModel.findOne({ name }).exec();
    }

    findByPermissions(permissionIds: Types.ObjectId[]): Promise<RoleDocument[]> {
        return this.roleModel.find({ permissions: { $in: permissionIds } }).exec();
    }


}