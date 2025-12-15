import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { Permission } from "../../permission/schema/Permission.schema";

export type RoleDocument = Role & Document;

@Schema()
export class Role {
    // _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }] })
    permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
