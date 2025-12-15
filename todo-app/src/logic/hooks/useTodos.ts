import { useState, useEffect } from "react";
import { todoService } from "@/data/services/todo.service";
import { useAuth } from "@/logic/hooks/useAuth";

export function useTodos(currentPage: number) {
    const [todos, setTodos] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuth();
    const pageSize = 3;

    const refreshTodos = () => {
        setLoading(true);
        todoService.getAllTodos(currentPage, pageSize)
            .then((data) => {
                setTodos(data.data || []);
                setTotalPages(Math.ceil((data.total || 0) / pageSize));
                setError("");
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    setError("Phiên đăng nhập đã hết hạn.");
                } else {
                    setError("Lỗi tải dữ liệu.");
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refreshTodos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, currentPage]);

    return {
        todos,
        totalPages,
        loading,
        error,
        refreshTodos,
    };
}
