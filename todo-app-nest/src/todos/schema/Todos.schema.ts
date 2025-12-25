import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";



export type TodoDocument = Todo & Document;

export enum TodoStatus {
    REJECTED = 'REJECTED',
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

@Schema({ timestamps: true })
export class Todo {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    assignee: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: false, default: '' })
    description: string;

    @Prop({ default: TodoStatus.TODO })
    status: TodoStatus;

    @Prop({ required: false, default: '' })
    rejectReason?: string;

    @Prop({ required: true, default: 'medium' })
    priority: 'low' | 'medium' | 'high';

    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);