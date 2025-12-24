import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { } from "mongoose";
import { Role } from "src/roles/schema/Role.schema";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop({ type: String, default: null })
    refreshToken: string | null;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }], default: [] })
    roles: Types.ObjectId[];

    @Prop()
    avatar: string;

    @Prop()
    address: string;

    @Prop()
    phoneNumber?: string;


}

export const UserSchema = SchemaFactory.createForClass(User);