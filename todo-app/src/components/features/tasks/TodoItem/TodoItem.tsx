"use client";
import "./todo_item.css";
import React from "react";
import { Todo } from "../../../../types/todos";

interface TodoItemProps {
    todo: Todo;
    onDelete: (id: string) => Promise<void>;
    onToggleComplete: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onDelete, onToggleComplete }: TodoItemProps) {
    const [loading, setLoading] = React.useState(false);
    const [toggleLoading, setToggleLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            await onDelete(todo._id);
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        setToggleLoading(true);
        setError(null);
        try {
            await onToggleComplete(todo._id);
        } catch (err: any) {
            setError(err.message || "Error");
        } finally {
            setToggleLoading(false);
        }
    };

    return (
        <li className="item-card item-card-vertical">
            <div className="item-detail item-detail-vertical">
                <div className="item-title">{todo.title}</div>
                {todo.description && <div className="item-description">{todo.description}</div>}
                <div className="item-status-container item-status-container-vertical">
                    <span className={`item-status ${todo.completed ? "item-status-completed" : "item-status-pending"}`}>{todo.completed ? "Hoàn thành" : "Chờ xử lý"}</span>
                    <span className={`item-priority ${todo.priority === "high" ? "item-priority-high" : todo.priority === "medium" ? "item-priority-medium" : "item-priority-low"}`}>{typeof todo.priority === "string" ? (todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)) : ""}</span>
                </div>
                <div className="item-meta">
                    {todo.createdAt && <span className="item-meta-created">Ngày tạo: {new Date(todo.createdAt).toLocaleString()}</span>}
                    {todo.updatedAt && <span className="item-meta-updated">Cập nhật: {new Date(todo.updatedAt).toLocaleString()}</span>}
                </div>
            </div>

            <div className="change-complete-container change-complete-container-vertical">
                {error && <span className="item-error">{error}</span>}
                <button
                    onClick={handleToggleStatus}
                    disabled={toggleLoading}
                    className={`btn-action ${todo.completed ? "btn-status-completed" : "btn-status-pending"} ${toggleLoading ? "btn-loading" : "btn-hover-scale"}`}
                >
                    {todo.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
                </button>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className={`btn-action ${loading ? "btn-delete-loading" : "btn-delete btn-hover-scale"}`}
                >
                    {loading ? "Đang xóa..." : "Xóa"}
                </button>
            </div>
        </li>
    );
}
