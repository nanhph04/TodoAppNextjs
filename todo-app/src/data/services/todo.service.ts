import axiosClient from "@/logic/libs/axiosClient";
import { Todo } from "@/data/interfaces/todos";

const API_URL = "/todos";

type TodoData = Pick<Todo, "title" | "description" | "priority" | "status">;

export const todoService = {
    getAllTodos: async (page: number = 1, limit: number = 3) => {
        try {
            const res = await axiosClient.get(`${API_URL}?page=${page}&limit=${limit}`);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    },
    findById: async (id: string) => {
        try {
            const res = await axiosClient.get(`${API_URL}/${id}`);
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
            const res = await axiosClient.get(`${API_URL}/stats`);
            return res.data;
        } catch (error: any) {
            throw error;
        }
    }
};






