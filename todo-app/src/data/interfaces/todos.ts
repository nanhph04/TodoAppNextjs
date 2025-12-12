export interface Todo {
    _id?: string;
    id?: string;
    userId?: string;
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    completed?: boolean;
    createdAt?: string;
    completedAt?: string;
}