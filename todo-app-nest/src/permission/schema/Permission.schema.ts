import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema } from "@nestjs/mongoose/dist/decorators/schema.decorator";

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission {
    @Prop({ required: true, unique: true })
    slug: string;

    @Prop()
    description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);