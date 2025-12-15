import axiosClient from "@/logic/libs/axiosClient";
export const userService = {
    getUserProfile: () => axiosClient.get(`/user/profile/`),

    getAllUsers: (page: number = 1, limit: number = 10) => axiosClient.get(`/user?page=${page}&limit=${limit}`),

    deleteUser: (id: string) => axiosClient.delete(`/user/${id}`),

    updateUser: (id: string, data: any) => axiosClient.put(`/user/${id}`, data),

    getUserById: (id: string) => axiosClient.get(`/user/${id}`),

    getUserPermissions: () => axiosClient.get(`/user/permissions`),

    getUserByEmail: (email: string) => axiosClient.get(`/user/by-email?email=${email}`),

    // updateUser: (id: string, data: any) => axiosClient.put(`/user/${id}`, data),
};