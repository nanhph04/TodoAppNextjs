import axiosClient from "@/logic/libs/axiosClient";
export const userService = {
    getUserProfile: (userId: string) => axiosClient.get(`/user/profile/${userId}`),
};