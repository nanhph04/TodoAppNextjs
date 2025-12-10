"use client";
import TodoList from "@/ui/pages/todo/TodoList/TodoList";
import styles from "@/ui/pages/todo/TodoListContainer/TodoListContainer.module.css";
import { getTodos } from "@/data/services/todo.service";
import { useAuth } from "@/logic/stores/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddTodo from "@/ui/pages/todo/AddTodo/AddTodo";
import { FaPlus } from "react-icons/fa";
import { LuFileClock } from "react-icons/lu";
import Button from "@/ui/components/Common/Button/Button.base";

export default function TodoListContainer() {
    // State declarations
    const [todos, setTodos] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const handleOpen = () => setShowAdd(true);
    const handleClose = () => setShowAdd(false);

    // Hooks
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Pagination logic
    const pageSize = 5;
    let page = 1;
    const pageParam = searchParams.get("page");
    if (pageParam) {
        const parsed = parseInt(pageParam, 10);
        if (!isNaN(parsed) && parsed > 0) page = parsed;
    }

    const refreshTodos = () => {
        if (!user) {
            const localData = localStorage.getItem('guest_todos');
            const todos = localData ? JSON.parse(localData) : [];
            setTodos(todos);
            setTotalPages(1);
            setCurrentPage(1);
            setError("");
            return;
        }
        setLoading(true);
        getTodos(page, pageSize)
            .then((data) => {
                setTodos(data.data || []);
                setTotalPages(Math.ceil((data.total || 0) / pageSize));
                setCurrentPage(page);
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
    }, [user, searchParams]);

    if (loading) {
        return <div className={styles['page-container']}>Đang tải...</div>;
    }
    if (error) {
        return (
            <div className={styles['page-container']}>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
    return (
        <div className={styles['todolist-container']}>
            <div className={styles['todo-list-container-top']}>
                <div className={styles['page-title']}>
                    <LuFileClock />
                    <p>Todo</p>
                </div>

                <Button
                    className={styles['add-todo-btn']}
                    onClick={handleOpen}
                    icon={<FaPlus color="#F24E1E" />}
                    title="Thêm công việc mới"
                />
                {showAdd && (
                    <div className={styles['add-todo-modal-overlay']} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                        <div className={styles['add-todo-modal']} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.15)", padding: 32, minWidth: 400, position: "relative" }}>
                            <button
                                className={styles['close-modal-btn']}
                                onClick={handleClose}
                                style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
                            >
                                &times;
                            </button>
                            <AddTodo onAdded={handleClose} />
                        </div>
                    </div>
                )}
            </div>
            <div className={styles['todolist-content']}>

                <TodoList todos={todos} page={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}
