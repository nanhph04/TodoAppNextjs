import axiosClient from "../libs/axiosClient";

const API_URL = "/todos";

function redirectToErrorPage() {
    if (typeof window !== 'undefined') {
        window.location.href = '/error';
    }
}

export async function getTodos(page: number = 1, limit: number = 5) {
    let config: any = {
        params: { page, limit }
    };
    if (typeof window === 'undefined') {
        try {
            const { cookies } = await import("next/headers");

            const cookieStore = await cookies();
            config.headers = {
                Cookie: cookieStore.toString()
            };
        } catch (error) {
            console.warn("Could not load cookies on server side", error);
        }
    }

    try {
        const res = await axiosClient.get(API_URL, config);
        return res.data;
    } catch (error: any) {
        if (error.response?.status !== 401) {
            redirectToErrorPage();
        }
        throw error;
    }
}

export async function addTodo({ title, description, priority }: { title: string; description: string; priority: "low" | "medium" | "high" }) {
    try {
        const res = await axiosClient.post(API_URL, { title, description, completed: false, priority });
        return res.data;
    } catch (error: any) {
        if (error.response?.status !== 401) redirectToErrorPage();
        throw error;
    }
}

export async function updateTodoStatus(id: string, completed: boolean) {
    try {
        const res = await axiosClient.put(`${API_URL}/${id}`, { completed });
        return res.data;
    } catch (error: any) {
        if (error.response?.status !== 401) redirectToErrorPage();
        throw error;
    }
}

export async function deleteTodo(id: string) {
    try {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    } catch (error: any) {
        if (error.response?.status !== 401) redirectToErrorPage();
        throw error;
    }
}