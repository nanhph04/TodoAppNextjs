"use client";
import React from "react";
import TodoItem from "@/ui/pages/todo/TodoItem/TodoItem";
import { Todo } from "@/data/interfaces/todos";
import { getTodos, deleteTodo as deleteTodoService, updateTodoStatus } from "@/data/services/todo.service";
import { useAuth } from "@/logic/stores/AuthContext";
import "./todo_list.css";
import Button from "@/ui/components/Common/Button/Button.base";

interface TodoListProps {
    todos: Todo[];
    page?: number;
    totalPages?: number;
}

const LOCAL_KEY = "guest_todos";

export default function TodoList({ todos: initialTodos, page, totalPages }: TodoListProps) {
    const { userId } = useAuth();
    const [todos, setTodos] = React.useState<Todo[]>(initialTodos);
    const currentPage = typeof page === "number" ? page : 1;
    const totalPageCount = typeof totalPages === "number" ? totalPages : 1;
    const pageSize = 5;

    const getLocalTodos = () => {
        try {
            const raw = localStorage.getItem(LOCAL_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };
    const setLocalTodos = (newTodos: Todo[]) => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(newTodos));
    };

    const deleteTodo = async (id: string) => {
        if (userId) {
            try {
                await deleteTodoService(id);
                await getTodos(currentPage, pageSize).then((data) => {
                    setTodos(data.data || []);
                });
            } catch (err) {
                alert("Delete failed");
            }
        } else {
            const updated = todos.filter(todo => todo._id !== id);
            setTodos(updated);
            setLocalTodos(updated);
        }
    };

    const updateStatus = async (id: string, completed: boolean) => {
        if (userId) {
            try {
                await updateTodoStatus(id, completed);
                await getTodos(currentPage, pageSize).then((data) => {
                    setTodos(data.data || []);
                });
            } catch (err) {
                alert("Update failed");
            }
        } else {
            setTodos((prev) => {
                const updated = prev.map(todo => todo._id === id ? { ...todo, completed, completedAt: completed ? new Date().toISOString() : undefined } : todo);
                setLocalTodos(updated);
                return updated;
            });
        }
    };

    const handlePageChange = (newPage: number) => {
        window.location.href = `/?page=${newPage}&limit=5`;
    };

    React.useEffect(() => {
        if (!userId) {
            setTodos(getLocalTodos());
        }
        setTodos(initialTodos);
    }, [userId, initialTodos]);

    return (
        <div className="todolist-container">
            <ul className="todolist-list">
                <li>
                    {todos.length === 0 ? (
                        <div className="todolist-empty">Không có công việc nào.</div>
                    ) : (
                        todos.map((todo, idx) => (
                            <TodoItem
                                key={todo._id || `todo-guest-${idx}`}
                                todo={todo}
                                onDelete={deleteTodo}
                                onToggleComplete={async (id: string) => { await updateStatus(id, !todo.completed); }}
                            />
                        ))
                    )}
                </li>
            </ul>
            <div className="todolist-pagination">
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="todolist-btn todolist-btn-prev"
                    title="← Previous"
                >
                </Button>
                <span className="todolist-pageinfo">Page {currentPage} / {totalPageCount}</span>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPageCount}
                    className="todolist-btn todolist-btn-next"
                    title="  Next →"
                >
                </Button>
            </div>
        </div>
    );
}
