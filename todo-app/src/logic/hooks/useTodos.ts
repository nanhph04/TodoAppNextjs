import { useState, useEffect, useCallback } from "react";
import { todoService } from "@/data/services/todo.service";
import { useAuth } from "@/logic/hooks/useAuth";
import type { Todo } from "@/data/interfaces/todos";

const PAGE_SIZE = 3;

export function useTodos(currentPage: number) {
    const { accessToken, isLoading: authLoading } = useAuth();

    const [todos, setTodos] = useState<Todo[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /** ================= LIST ================= */
    const fetchTodos = useCallback(async () => {
        if (!accessToken) return;

        try {
            setLoading(true);
            const res = await todoService.getAllTodos(currentPage, PAGE_SIZE);

            setTodos(res.data ?? []);
            setTotalPages(Math.ceil((res.total ?? 0) / PAGE_SIZE));
            setError("");
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError("Phiên đăng nhập đã hết hạn.");
            } else {
                setError("Lỗi tải danh sách công việc.");
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken, currentPage]);

    useEffect(() => {
        if (authLoading) return;

        if (!accessToken) {
            setTodos([]);
            setTotalPages(1);
            return;
        }

        fetchTodos();
    }, [authLoading, accessToken, fetchTodos]);

    /** ================= ACTIONS ================= */
    const deleteTodo = useCallback(async (id: string) => {
        try {
            await todoService.deleteTodo(id);
            fetchTodos();
        } catch {
            setError("Xóa công việc thất bại.");
        }
    }, [fetchTodos]);

    const update = useCallback(
        async (id: string, payload: Partial<Todo>) => {
            try {
                const updated = await todoService.updateTodo(id, payload);
                fetchTodos();
                // Trả về todo đã cập nhật (nếu có)
                return (updated?.data ?? updated) as Todo;
            } catch {
                setError("Cập nhật công việc thất bại.");
                return undefined;
            }
        },
        [fetchTodos]
    );

    /** ================= DETAIL ================= */
    const findById = useCallback(async (id: string): Promise<Todo | null> => {
        try {
            const res = await todoService.findById(id);
            return (res?.data ?? res) ?? null;
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError("Phiên đăng nhập đã hết hạn.");
            } else {
                setError("Lỗi tải chi tiết công việc.");
            }
            return null;
        }
    }, []);

    return {
        todos,
        totalPages,
        loading,
        error,

        refreshTodos: fetchTodos,
        deleteTodo,
        update,
        findById,
    };
}
