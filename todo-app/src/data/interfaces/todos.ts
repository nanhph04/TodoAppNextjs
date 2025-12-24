export interface Todo {
    _id?: string;
    assigneeId?: string;
    creatorId?: string;
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: "TODO" | "IN_PROGRESS" | "DONE";
    dueDate?: string;
    createdAt?: string;
    completedAt?: string;
}