"use client";
import TodoList from "@/components/features/tasks/TodoList/TodoList";
import styles from "@/app/page.module.css";
import { getTodos } from "@/services/todo.service";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TodoListContainer() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [todos, setTodos] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            router.replace("/login");
            return;
        }
        const pageSize = 5;
        let page = 1;
        const pageParam = searchParams.get("page");
        if (pageParam) {
            const parsed = parseInt(pageParam, 10);
            if (!isNaN(parsed) && parsed > 0) page = parsed;
        }
        setLoading(true);
        getTodos(page, pageSize)
            .then((data) => {
                setTodos(data.todos || []);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(data.page || page);
                setError("");
                if (data.page > data.totalPages && data.totalPages > 0) {
                    router.replace(`/?page=${data.totalPages}`);
                }
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    router.replace("/login");
                } else {
                    setError("Không thể tải danh sách công việc. Vui lòng thử lại sau.");
                }
            })
            .finally(() => setLoading(false));
    }, [user, searchParams, router]);

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
