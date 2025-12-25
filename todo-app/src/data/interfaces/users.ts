export interface User {
    userId: string;
    fullName: string;
    email: string;
    password?: string;
    roles: string[];
    permissions: string[];
    refreshToken: string;
    createdAt: string;
    updatedAt: string;
}