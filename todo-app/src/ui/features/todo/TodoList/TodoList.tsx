"use client";
import TodoItem from "@/ui/features/todo/TodoItem/TodoItem";
import { Todo } from "@/data/interfaces/todos";
import "./todo_list.css";
import Button from "@/ui/components/Common/Button/Button.base";

interface TodoListProps {
    todos: Todo[];
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onDelete: (id: string) => Promise<void>;
}

export default function TodoList({ todos, page, totalPages, onPageChange, onDelete }: TodoListProps) {
    const currentPage = typeof page === "number" ? page : 1;
    const totalPageCount = typeof totalPages === "number" ? totalPages : 1;

    const handlePageChange = (newPage: number) => {
        if (onPageChange) onPageChange(newPage);
    };

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
                                onDelete={onDelete}
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
