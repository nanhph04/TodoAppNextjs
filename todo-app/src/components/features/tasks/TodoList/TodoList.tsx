"use client";
import React from "react";
import TodoItem from "@/components/features/tasks/TodoItem/TodoItem";
import AddTodo from "@/components/features/tasks/AddTodo/AddTodo";
import { Todo } from "@/types/todos";
import { getTodos, deleteTodo as deleteTodoService, updateTodoStatus } from "@/services/todo.service";
import "./todo_list.css";

interface TodoListProps {
    todos: Todo[];
    page?: number;
    totalPages?: number;
}

export default function TodoList({ todos: initialTodos, page, totalPages }: TodoListProps) {
    const [todos, setTodos] = React.useState<Todo[]>(initialTodos);
    const currentPage = typeof page === "number" ? page : 1;
    const totalPageCount = typeof totalPages === "number" ? totalPages : 1;

    const pageSize = 5;
    const deleteTodo = async (id: string) => {
        try {
            await deleteTodoService(id);
            setTodos((prev) => prev.filter(todo => todo._id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const updateStatus = async (id: string, completed: boolean) => {
        try {
            const updated = await updateTodoStatus(id, completed);
            setTodos((prev) => prev.map(todo => todo._id === id ? { ...todo, completed: updated.completed } : todo));
        } catch (err) {
            alert("Update failed");
        }
    };

    const handlePageChange = (newPage: number) => {
        window.location.href = `/?page=${newPage}`;
    };

    const fetchTodos = async () => {
        try {
            const data = await getTodos(currentPage, pageSize);
            setTodos(Array.isArray(data.todos) ? data.todos : []);
        } catch {
            alert("Fetch todos failed");
        }
    };

    const handleAddTodo = async () => {
        await fetchTodos();
    };

    return (
        <div className="todolist-container">
            <AddTodo onAdded={handleAddTodo} />
            <ul className="todolist-list">
                {todos.length === 0 ? (
                    <div className="todolist-empty">Không có công việc nào.</div>
                ) : (
                    todos.map((todo) => (
                        <TodoItem
                            key={todo._id}
                            todo={todo}
                            onDelete={deleteTodo}
                            onToggleComplete={(id: string) => updateStatus(id, !todo.completed)}
                        />
                    ))
                )}
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
