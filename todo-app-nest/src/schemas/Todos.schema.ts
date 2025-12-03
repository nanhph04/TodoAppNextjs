import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: false, default: '' })
    description: string;

    @Prop({ required: true, default: false })
    completed: boolean;

    @Prop({ required: true, default: 'medium' })
    priority: 'low' | 'medium' | 'high';
}

export const TodoSchema = SchemaFactory.createForClass(Todo);