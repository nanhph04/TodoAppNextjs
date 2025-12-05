import axiosClient from "@/logic/libs/axiosClient";
export const authService = {
    login: (data: any) => axiosClient.post('/auth/signin', data),

    register: (data: any) => axiosClient.post('/auth/signup', data),

    logout: (userId: string) => axiosClient.post('/auth/logout', { userId }),

    refreshToken: () => axiosClient.post('/auth/refresh'),
}