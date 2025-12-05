import axiosClient from "@/logic/libs/axiosClient";



function redirectToErrorPage() {
    // Đã bỏ logic chuyển trang khi lỗi
}

export async function getTodos(userId: string, page: number = 1, limit: number = 5) {
    try {
        const url = `/api/todos/user/${userId}?page=${page}&limit=${limit}`;
        console.log("GET TODOS URL:", url);
        const res = await axiosClient.get(url);
        console.log("GET TODOS RESPONSE:", res.data);
        if (typeof window === 'undefined') {
            console.log("[SERVER] GET TODOS URL:", url);
            console.log("[SERVER] GET TODOS RESPONSE:", res.data);
        }
        return res.data;
    } catch (error: any) {
        if (typeof window === 'undefined') {
            console.error("[SERVER] GET TODOS ERROR:", error);
        }


        throw error;
    }
}

export async function addTodo({ userId, title, description, priority }: { userId: string; title: string; description: string; priority: "low" | "medium" | "high" }) {
    try {
        const res = await axiosClient.post(API_URL, { userId, title, description, completed: false, priority });
        console.log("Added todo:", res.data);
        return res.data;
    } catch (error: any) {
        // Không chuyển trang khi lỗi
        throw error;
    }
}

export async function updateTodo(id: string, data: { title?: string; description?: string; priority?: "low" | "medium" | "high"; completed?: boolean; completedAt?: string }) {
    try {
        const res = await axiosClient.put(`${API_URL}/${id}`, data);
        return res.data;
    } catch (error: any) {
        // Không chuyển trang khi lỗi
        throw error;
    }
}

export async function updateTodoStatus(id: string, completed: boolean) {
    try {
        const res = await axiosClient.put(`${API_URL}/${id}`, { completed });
        return res.data;
    } catch (error: any) {
        // Không chuyển trang khi lỗi
        throw error;
    }
}

export async function deleteTodo(id: string) {
    try {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    } catch (error: any) {
        // Không chuyển trang khi lỗi
        throw error;
    }
}
const API_URL = "/api/todos";
export async function syncTodos(data: any) {
    try {
        const res = await axiosClient.post(`${API_URL}/sync`, data);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}