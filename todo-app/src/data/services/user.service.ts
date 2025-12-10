import axiosClient from "@/logic/libs/axiosClient";
export const userService = {
    getUserProfile: () => axiosClient.get(`/user/profile/`),
};