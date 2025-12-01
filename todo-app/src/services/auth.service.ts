import axiosClient from "../libs/axiosClient";
export const authService = {
    login: (data: any) => axiosClient.post('/auth/login', data),

    register: (data: any) => axiosClient.post('/auth/register', data),

    logout: () => axiosClient.post('/auth/logout'),

    refreshToken: () => axiosClient.post('/auth/refresh'),

    syncTodos: (data: any) => axiosClient.post('/todos/sync', data),
}