export interface Todo {
    _id: string;
    id: string;
    userId: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    createdAt: string;
    updatedAt: string;
}