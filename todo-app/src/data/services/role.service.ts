import axiosClient from "@/logic/libs/axiosClient";

export const roleService = {
    getRoles: () => axiosClient.get('/roles'),

    create: (data: any) => axiosClient.post('/roles', data),

    getRoleById: (id: string) => axiosClient.get(`/roles/${id}`),
    
    createRole: (data: any) => axiosClient.post('/roles', data),

    updateRole: (id: string, data: any) => axiosClient.put(`/roles/${id}`, data),

}