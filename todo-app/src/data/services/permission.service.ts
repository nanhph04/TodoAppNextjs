import axiosClient from "@/logic/libs/axiosClient";

export const permissionService = {
    getPermissions: () => axiosClient.get("/permissions"),
    getPermissionById: (id: string) => axiosClient.get(`/permissions/${id}`),
}