import { Types } from "mongoose";
import { TodoStatus } from "./Todos.schema";

export interface PopulatedUser {
    _id: Types.ObjectId | string;
    fullName: string;
}

export interface TodoLean {
    _id: Types.ObjectId | string;
    title: string;
    description: string;
    status: TodoStatus;
    priority: 'low' | 'medium' | 'high';
    assignee?: PopulatedUser;
    createdBy?: PopulatedUser;
}