import axiosClient from "@/logic/libs/axiosClient";
export const userService = {
    getUserProfile: () => axiosClient.get(`/user/profile/`),

    getAllUsers: (page: number = 1, limit: number = 10) => axiosClient.get(`/user?page=${page}&limit=${limit}`),

    deleteUser: (id: string) => axiosClient.delete(`/user/${id}`),

    // updateUser: (id: string, data: any) => axiosClient.put(`/user/${id}`, data),
};