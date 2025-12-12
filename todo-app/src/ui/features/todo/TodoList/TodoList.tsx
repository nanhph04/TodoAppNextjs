"use client";
import React from "react";
import TodoItem from "@/ui/features/todo/TodoItem/TodoItem";
import { Todo } from "@/data/interfaces/todos";
import { todoService } from "@/data/services/todo.service";
import "./todo_list.css";
import Button from "@/ui/components/Common/Button/Button.base";

interface TodoListProps {
    todos: Todo[];
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export default function TodoList({ todos: initialTodos, page, totalPages, onPageChange }: TodoListProps) {
    const [todos, setTodos] = React.useState<Todo[]>(initialTodos);
    const currentPage = typeof page === "number" ? page : 1;
    const totalPageCount = typeof totalPages === "number" ? totalPages : 1;
    const pageSize = 3;

    const deleteTodo = async (id: string) => {
        try {
            await todoService.deleteTodo(id);
            await todoService.getTodos(currentPage, pageSize).then((data) => {
                setTodos(data.data || []);
            });
        } catch (err) {
            alert("Delete failed");
        }
    };

    const updateStatus = async (id: string, completed: boolean) => {
        try {
            await todoService.updateTodo(id, { completed });
            await todoService.getTodos(currentPage, pageSize).then((data) => {
                setTodos(data.data || []);
            });
        } catch (err) {
            alert("Update failed");
        }
    };

    const handlePageChange = (newPage: number) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    };

    React.useEffect(() => {
        setTodos(initialTodos);
    }, [initialTodos]);

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
                />
                <span className="todolist-pageinfo">Page {currentPage} / {totalPageCount}</span>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPageCount}
                    className="todolist-btn todolist-btn-next"
                    title="  Next →"
                />
            </div>
        </div>
    );
}
