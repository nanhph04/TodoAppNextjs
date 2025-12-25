export interface UserRef {
    _id: string;
    fullName?: string;
}

export interface Todo {
    _id?: string;
    assignee?: string | UserRef;
    createdBy?: string | UserRef;
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: "REJECTED" | "TODO" | "IN_PROGRESS" | "DONE";
    rejectReason?: string;
    dueDate?: string;
    createdAt?: string;
    completedAt?: string;
}