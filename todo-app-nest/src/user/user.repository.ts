

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schema/User.schema";
import { Model } from "mongoose";
import { Types } from "mongoose";

@Injectable()
export class UserRepository {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async findAll(page: number = 1, limit: number = 10): Promise<UserDocument[]> {
        const skip = (page - 1) * limit;
        return this.userModel.find().skip(skip).limit(limit).exec();
    }

    async findById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId).exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async create(userData: Partial<UserDocument>): Promise<UserDocument> {
        const newUser = new this.userModel(userData);
        return newUser.save();
    }

    async update(userId: string, updateData: Partial<UserDocument>): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    }

    async delete(userId: string): Promise<UserDocument | null> {
        return this.userModel.findByIdAndDelete(userId).exec();
    }

    async getUserPermissions(userId: Types.ObjectId) {
        return this.userModel
            .findById(userId)
            .select('roles')
            .populate({
                path: 'roles',
                select: 'permissions',
                populate: {
                    path: 'permissions',
                    select: 'slug',
                },
            })
            .exec();
    }


}