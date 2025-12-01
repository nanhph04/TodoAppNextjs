import axiosClient from "../libs/axiosClient";
export const userService = {
    getUserProfile: () => axiosClient.get('/user/profile'),

    updateUserProfile: (data: any) => axiosClient.put('/user/profile', data),
}