import axiosClient from "@/logic/libs/axiosClient";
import { Todo } from "@/data/interfaces/todos";

const API_URL = "/api/todos";

type TodoData = Pick<Todo, "title" | "description" | "priority">;

export const todoService = {
    getAllTodos: async (page: number = 1, limit: number = 3) => {
        try {
            const res = await axiosClient.get(`${API_URL}?page=${page}&limit=${limit}`);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    },
    getTodos: async (page: number = 1, limit: number = 3) => {
        try {
            const res = await axiosClient.get(`${API_URL}/me?page=${page}&limit=${limit}`);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    },

    addTodo: async (data: TodoData) => {
        try {
            const res = await axiosClient.post(API_URL, { ...data, completed: false });
            return res.data;
        } catch (error: any) {
            throw error;
        }
    },

    updateTodo: async (id: string, data: Partial<TodoData> & { completed?: boolean }) => {
        try {
            const res = await axiosClient.put(`${API_URL}/${id}`, data);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    },

    deleteTodo: async (id: string) => {
        try {
            const res = await axiosClient.delete(`${API_URL}/${id}`);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    },

    countStatus: async () => {
        try {
            const res = await axiosClient.get(`${API_URL}/count-status`);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }
};



// export async function getTodos(page: number = 1, limit: number = 5) {
//     try {
//         const url = `/api/todos/me?page=${page}&limit=${limit}`;
//         console.log("GET TODOS URL:", url);
//         const res = await axiosClient.get(url);
//         console.log("GET TODOS RESPONSE:", res.data);
//         if (typeof window === 'undefined') {
//             console.log("[SERVER] GET TODOS URL:", url);
//             console.log("[SERVER] GET TODOS RESPONSE:", res.data);
//         }
//         return res.data;
//     } catch (error: any) {
//         if (typeof window === 'undefined') {
//             console.error("[SERVER] GET TODOS ERROR:", error);
//         }
//         throw error;
//     }
// }

// export async function addTodo({ title, description, priority }: { title: string; description: string; priority: "low" | "medium" | "high" }) {
//     try {
//         const res = await axiosClient.post(API_URL, { title, description, completed: false, priority });
//         console.log("Added todo:", res.data);
//         return res.data;
//     } catch (error: any) {
//         throw error;
//     }
// }

// export async function updateTodo(id: string, data: { title?: string; description?: string; priority?: "low" | "medium" | "high"; completed?: boolean; completedAt?: string }) {
//     try {
//         const res = await axiosClient.put(`${API_URL}/${id}`, data);
//         return res.data;
//     } catch (error: any) {
//         throw error;
//     }
// }

// export async function updateTodoStatus(id: string, completed: boolean) {
//     try {
//         const res = await axiosClient.put(`${API_URL}/${id}`, { completed });
//         return res.data;
//     } catch (error: any) {
//         throw error;
//     }
// }

// export async function deleteTodo(id: string) {
//     try {
//         const res = await axiosClient.delete(`${API_URL}/${id}`);
//         return res.data;
//     } catch (error: any) {
//         throw error;
//     }
// }


