import axiosClient from "@/logic/libs/axiosClient";
export const authService = {
    login: (data: any) => axiosClient.post('/auth/signin', data),

    register: (data: any) => axiosClient.post('/auth/signup', data),

    logout: () => axiosClient.post('/auth/logout'),

    refreshToken: () => axiosClient.post('/auth/refresh'),

    loginWithGoogle: (token: string) => axiosClient.post('/auth/google', { token }),
}