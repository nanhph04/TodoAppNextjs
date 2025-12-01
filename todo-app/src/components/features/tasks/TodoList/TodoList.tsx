"use client";
import React from "react";
import TodoItem from "@/components/features/tasks/TodoItem/TodoItem";
import AddTodo from "@/components/features/tasks/AddTodo/AddTodo";
import { Todo } from "@/types/todos";
import { getTodos, deleteTodo as deleteTodoService, updateTodoStatus } from "@/services/todo.service";
import { useAuth } from "@/context/AuthContext";
import "./todo_list.css";

interface TodoListProps {
    todos: Todo[];
    page?: number;
    totalPages?: number;
}

const LOCAL_KEY = "guest_todos";

export default function TodoList({ todos: initialTodos, page, totalPages }: TodoListProps) {
    const { user } = useAuth();
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
        if (user) {
            try {
                await deleteTodoService(id);
                setTodos((prev) => prev.filter(todo => todo._id !== id));
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
        if (user) {
            try {
                const updated = await updateTodoStatus(id, completed);
                setTodos((prev) => prev.map(todo => todo._id === id ? { ...todo, completed: updated.completed } : todo));
            } catch (err) {
                alert("Update failed");
            }
        } else {
            setTodos((prev) => {
                const updated = prev.map(todo => todo._id === id ? { ...todo, completed } : todo);
                setLocalTodos(updated);
                return updated;
            });
        }
    };

    const handlePageChange = (newPage: number) => {
        window.location.href = `/?page=${newPage}`;
    };

    const fetchTodos = async () => {
        if (user) {
            try {
                const data = await getTodos(currentPage, pageSize);
                setTodos(Array.isArray(data.todos) ? data.todos : []);
            } catch {
                alert("Fetch todos failed");
            }
        } else {
            setTodos(getLocalTodos());
        }
    };

    const handleAddTodo = async () => {
        await fetchTodos();
    };

    React.useEffect(() => {
        if (!user) {
            setTodos(getLocalTodos());
        }
    }, [user]);

    return (
        <div className="todolist-container">
            <AddTodo onAdded={handleAddTodo} />
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
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="todolist-btn todolist-btn-prev"
                >
                    ← Previous
                </button>
                <span className="todolist-pageinfo">Page {currentPage} / {totalPageCount}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPageCount}
                    className="todolist-btn todolist-btn-next"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
