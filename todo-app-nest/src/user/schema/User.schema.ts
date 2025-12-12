import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

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

    @Prop({ type: String, enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Prop()
    avatar: string;

    @Prop()
    address: string;

    @Prop()
    phoneNumber?: string;


}

export const UserSchema = SchemaFactory.createForClass(User);