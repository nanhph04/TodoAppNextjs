"use client";
import TodoList from "@/ui/pages/todo/TodoList/TodoList";
import styles from "@/ui/pages/todo/TodoListContainer/TodoListContainer.module.css";
import { getTodos } from "@/data/services/todo.service";
import { useAuth } from "@/logic/stores/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TodoListContainer() {
    const { user, userId } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [todos, setTodos] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const pageSize = 5;
        let page = 1;
        const pageParam = searchParams.get("page");
        if (pageParam) {
            const parsed = parseInt(pageParam, 10);
            if (!isNaN(parsed) && parsed > 0) page = parsed;
        }

        setLoading(true);
        console.log(`Fetching todos for User: ${userId}, Page: ${page}, Limit: ${pageSize}`);

        if (!userId) {
            try {
                const localData = localStorage.getItem('guest_todos');
                const todos = localData ? JSON.parse(localData) : [];
                setTodos(todos);
                setTotalPages(1);
                setCurrentPage(1);
                setError("");
            } catch (err) {
                setError("Lỗi tải dữ liệu guest.");
            }
            setLoading(false);
            return;
        }

        getTodos(userId, page, pageSize)
            .then((data) => {
                console.log("Dữ liệu trả về:", data);
                setTodos(data.data || []);
                setTotalPages(Math.ceil((data.total || 0) / pageSize));
                setCurrentPage(page);
                setError("");
            })
            .catch((err) => {
                console.error("Lỗi getTodos:", err);
                if (err.response?.status === 401) {
                    setError("Phiên đăng nhập đã hết hạn.");
                } else {
                    setError("Lỗi tải dữ liệu.");
                }
            })
            .finally(() => setLoading(false));

    }, [userId, searchParams]);

    if (loading) {
        return <div className={styles.pageContainer}>Đang tải...</div>;
    }
    if (error) {
        return (
            <div className={styles.pageContainer}>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
    return (
        <div className={styles.pageContainer}>
            <TodoList todos={todos} page={currentPage} totalPages={totalPages} />
        </div>
    );
}
