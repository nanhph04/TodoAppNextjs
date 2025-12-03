export interface User {
    _id: string;
    fullName: string;
    email: string;
    password?: string;
    refreshToken?: string;
    createdAt: string;
    updatedAt: string;
}