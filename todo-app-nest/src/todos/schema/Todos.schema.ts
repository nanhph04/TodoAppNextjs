import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/user/schema/User.schema";


export type TodoDocument = Todo & Document;

export enum TodoStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

@Schema({ timestamps: true })
export class Todo {
    // Người được giao việc (Dùng để filter: task:read:own)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    assignee: User;

    // Người tạo task (Để tracking hoặc cho phép người tạo được sửa/xoá)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: User;

    @Prop({ required: true })
    title: string;

    @Prop({ required: false, default: '' })
    description: string;

    @Prop({ default: TodoStatus.TODO })
    status: TodoStatus;

    @Prop({ required: true, default: 'medium' })
    priority: 'low' | 'medium' | 'high';
}

export const TodoSchema = SchemaFactory.createForClass(Todo);