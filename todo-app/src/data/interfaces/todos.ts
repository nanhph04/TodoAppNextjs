import { User } from "./users";

export interface Todo {
    _id?: string;
    id?: string;
    assigneeId?: string;
    creatorId?: string;
    assignee?: User;
    creator?: User;
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: "pending" | "in-progress" | "completed";
    dueDate?: string;
    createdAt?: string;
    completedAt?: string;
}